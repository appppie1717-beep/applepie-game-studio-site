import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const privateDocumentDataPattern =
  /[가-힣]{2,}(?:로|길)\s+\d{1,4}(?:-\d{1,4})?|(?:19|20)\d{2}년\s*\d{1,2}월\s*\d{1,2}일|\b\d{4}(?:-\d{4}){3}\b/;

const htmlFormattingGap =
  String.raw`(?:\s|&nbsp;|&#(?:32|x20);|<!--[\s\S]*?-->|<[^>]+>)+`;
const forbiddenErsiyanGameStudioPatterns = [
  new RegExp(String.raw`에르시안${htmlFormattingGap}게임${htmlFormattingGap}스튜디오`, "i"),
  new RegExp(String.raw`\bERSIYAN${htmlFormattingGap}GAME${htmlFormattingGap}STUDIO\b`, "i"),
];
const homepageHeroPattern =
  /<h1\b(?=[^>]*\bid=["']hero-title["'])[^>]*>(?:\s|<!--[\s\S]*?-->)*제가 좋아하는 게임을(?:\s|<!--[\s\S]*?-->)*<br\s*\/?>(?:\s|<!--[\s\S]*?-->)*<span\b[^>]*>(?:\s|<!--[\s\S]*?-->)*직접 만들고(?:\s|<!--[\s\S]*?-->)*<\/span>(?:\s|<!--[\s\S]*?-->)*<br\s*\/?>(?:\s|<!--[\s\S]*?-->)*끝까지 운영합니다\.(?:\s|<!--[\s\S]*?-->)*<\/h1>/i;

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("stages every public page for asset-first delivery", async () => {
  const [
    manifestSource,
    pathsSource,
    homepage,
    velsienSummit,
    privacyPolicy,
    mineLogicPrivacyPolicy,
    archivedPrivacyPolicy,
    archivedPrivacyPolicy20260823,
    staticHomepage,
    staticVelsienSummit,
    staticPrivacyPolicy,
    staticMineLogicPrivacyPolicy,
    staticArchivedPrivacyPolicy,
    staticArchivedPrivacyPolicy20260823,
    staticNotFound,
  ] = await Promise.all([
    readFile(new URL("../dist/server/vinext-prerender.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/vinext-prerender-paths.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/index.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/velsien-summit.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy/mine-logic.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy/archive/2026-08-22.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy/archive/2026-08-23.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/index.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/velsien-summit.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy/mine-logic.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy/archive/2026-08-22.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy/archive/2026-08-23.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/404.html", import.meta.url), "utf8"),
  ]);

  const manifest = JSON.parse(manifestSource);
  const paths = JSON.parse(pathsSource);
  const renderedRoutes = new Map(
    manifest.routes.map(({ route, status }) => [route, status]),
  );

  assert.equal(renderedRoutes.get("/"), "rendered");
  assert.equal(renderedRoutes.get("/velsien-summit"), "rendered");
  assert.equal(renderedRoutes.get("/privacy"), "rendered");
  assert.equal(renderedRoutes.get("/privacy/mine-logic"), "rendered");
  assert.equal(renderedRoutes.get("/privacy/archive/2026-08-22"), "rendered");
  assert.equal(renderedRoutes.get("/privacy/archive/2026-08-23"), "rendered");
  assert.deepEqual(
    [...paths.paths].sort(),
    [
      "/",
      "/privacy",
      "/privacy/archive/2026-08-22",
      "/privacy/archive/2026-08-23",
      "/privacy/mine-logic",
      "/velsien-summit",
    ].sort(),
  );
  assert.match(homepage, /<title>에르시안<\/title>/i);
  assert.match(
    velsienSummit,
    /<title>VELSIEN SUMMIT\(벨시엔 서밋\) \| 모바일 수집형 2D SRPG<\/title>/i,
  );
  assert.match(privacyPolicy, /<title>개인정보처리방침 \| 에르시안<\/title>/i);
  assert.match(mineLogicPrivacyPolicy, /<title>MINE LOGIC Privacy Policy \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy, /<title>개인정보처리방침 2026년 8월 22일 보관본 \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy20260823, /<title>개인정보처리방침 2026년 8월 23일 보관본 \| 에르시안<\/title>/i);
  assert.equal(staticHomepage, homepage);
  assert.equal(staticVelsienSummit, velsienSummit);
  assert.equal(staticPrivacyPolicy, privacyPolicy);
  assert.equal(staticMineLogicPrivacyPolicy, mineLogicPrivacyPolicy);
  assert.equal(staticArchivedPrivacyPolicy, archivedPrivacyPolicy);
  assert.equal(staticArchivedPrivacyPolicy20260823, archivedPrivacyPolicy20260823);
  assert.match(staticNotFound, /<title>에르시안<\/title>/i);
  for (const publicHtml of [
    staticHomepage,
    staticVelsienSummit,
    staticPrivacyPolicy,
    staticMineLogicPrivacyPolicy,
    staticArchivedPrivacyPolicy,
    staticArchivedPrivacyPolicy20260823,
    staticNotFound,
  ]) {
    for (const forbiddenPattern of forbiddenErsiyanGameStudioPatterns) {
      assert.doesNotMatch(publicHtml, forbiddenPattern);
    }
  }
  assert.match(staticHomepage, homepageHeroPattern);
  assert.match(staticHomepage, /게임제작업자 등록번호/);
  assert.match(staticHomepage, /제2026-000002호/);
  assert.doesNotMatch(staticHomepage, /\/_next\/image\?/);
  assert.doesNotMatch(
    staticHomepage,
    /<link\b(?=[^>]*rel="preload")(?=[^>]*velsien-summit)[^>]*>/i,
  );
  assert.doesNotMatch(staticVelsienSummit, /\/_next\/image\?/);
  assert.doesNotMatch(staticPrivacyPolicy, /\/_next\/image\?/);
  assert.doesNotMatch(staticMineLogicPrivacyPolicy, /\/_next\/image\?/);
});

test("server-renders the official studio homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(html, /<title>에르시안<\/title>/i);
  assert.match(html, homepageHeroPattern);
  assert.match(html, /에르시안은 제가 직접 게임을 만들고 운영하는 곳입니다/);
  assert.doesNotMatch(html, /스튜디오/);
  assert.match(html, /작품 둘러보기/);
  assert.match(html, /게임을 선택해 화면과 소개를 둘러보세요/);
  assert.match(html, /OUR GAMES · 01/);
  assert.match(html, /게임을 만들 때[\s\S]*신경 쓰는 것/);
  assert.match(html, /MINE LOGIC/);
  assert.match(html, /VELSIEN SUMMIT/);
  assert.match(html, /com\.applepie\.minelogic/);
  assert.match(html, /mailto:asoul122@naver\.com/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-selected="true"/);
  assert.doesNotMatch(html, /사업자 정보 펼쳐보기/);
  assert.equal(
    html.match(/<a\b[^>]*href="\/velsien-summit"[^>]*>/gi)?.length ?? 0,
    1,
  );
  assert.match(html, /VELSIEN SUMMIT 자세히 보기/);
  assert.match(html, /SNEAK PEEK/);
  assert.match(html, /MOBILE · COLLECTIBLE · 2D SRPG/);
  assert.match(html, /세계관 신호/);
  assert.match(html, /WORLD FILE \/\/ PUBLIC ACCESS 03%/);
  assert.match(html, /지금 공개할 수 있는 설정은 여기까지입니다/);
  assert.match(html, /도시의 정상으로 향하는 계약/);
  assert.match(html, /어느 기업에도 묶이지 않은 계약자/);
  assert.match(html, /세 개의 기업 채널/);
  assert.match(html, /MORE DATA LOCKED UNTIL NEXT DEV LOG/);
  assert.equal(
    html.match(/id="game-tab-(?:mine-logic|velsien)"/g)?.length ?? 0,
    2,
  );
  assert.equal(
    html.match(/id="velsien-mode-tab-(?:scenes|world)"/g)?.length ?? 0,
    2,
  );
  assert.equal(
    html.match(/id="velsien-scene-(?:title|lobby|character)"/g)?.length ?? 0,
    3,
  );
  assert.equal(html.match(/aria-pressed="true"/g)?.length ?? 0, 1);
  for (const image of [
    "teaser-title.webp",
    "teaser-lobby.webp",
    "teaser-character.webp",
  ]) {
    assert.match(
      html,
      new RegExp(
        `<img\\b(?=[^>]*src="/images/velsien-summit/${image.replace(".", "\\.")}")(?=[^>]*alt="[^"]+")(?=[^>]*loading="lazy")[^>]*>`,
        "i",
      ),
    );
  }
  assert.doesNotMatch(
    html,
    /RECEIVED TEXT|OPEN CHANNELS|PUBLIC SIGNALS|END OF PUBLIC RECORD|추가 데이터는 아직 공개되지 않았습니다/,
  );
  assert.doesNotMatch(
    html,
    /첫 게임에서 다듬은 제작의 습관|작은 규칙을 끝까지 설명하고|하나의 브랜드로|한 작품씩 선보입니다|경험을 지향합니다|세계로 확장하고 있습니다|Logic becomes play|만든 게임과 만들고 있는 게임|MINE LOGIC은 출시했고, VELSIEN SUMMIT은 만드는 중입니다|제가 중요하게 보는 것|처음 만든 게임은 MINE LOGIC입니다|제가 만들 때 가장 많이 신경 쓰는 세 가지입니다|TWO GAMES · 03|지뢰찾기 다음에는|장르는 다르지만 두 게임 모두|CONTACT · 04|두 번째 게임을 만들고 있습니다/,
  );
  assert.doesNotMatch(html, /게임물제작업 등록을 마쳤으며/);
  assert.match(html, /206-43-62580/);
  assert.match(html, /제2026-광주광산-0682호/);
  assert.match(html, /제2026-000002호/);
  assert.match(html, /전남광주통합특별시 광산구청/);
  assert.match(html, /010-2416-6267/);
  assert.match(html, /tel:01024166267/);
  assert.match(html, /Cloudflare, Inc\./);
  assert.match(html, /bizCommPop\.do\?wrkr_no=2064362580/);
  assert.match(html, /공정위 신고 조회/);
  assert.doesNotMatch(html, /사업자정보확인|<dt>업태<\/dt>|<dt>종목<\/dt>/);
  assert.match(html, /이 홈페이지에서는 주문이나 결제를 받지 않습니다/);
  assert.match(html, /ersiyan-social-card\.jpg/);
  assert.match(
    html,
    /name="twitter:image:alt" content="에르시안 로고"/i,
  );
  assert.match(html, /ersiyan-logo-hero\.webp/);
  assert.match(html, /rel="canonical" href="https:\/\/ersiyan\.com\/?"/i);
  assert.match(html, /property="og:url" content="https:\/\/ersiyan\.com\/?"/i);
  assert.match(html, /property="og:site_name" content="ERSIYAN"/i);
  assert.match(html, /href="\/privacy\/mine-logic"[^>]*>MINE LOGIC 개인정보처리방침<\/a>/);
  assert.doesNotMatch(
    html,
    privateDocumentDataPattern,
  );
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|Starter Project/);
});

test("server-renders the VELSIEN SUMMIT promotional page", async () => {
  const response = await render("/velsien-summit?utm_source=naver");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(
    html,
    /<title>VELSIEN SUMMIT\(벨시엔 서밋\) \| 모바일 수집형 2D SRPG<\/title>/i,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/ersiyan\.com\/velsien-summit"/i,
  );
  assert.match(
    html,
    /property="og:url" content="https:\/\/ersiyan\.com\/velsien-summit"/i,
  );
  assert.match(
    html,
    /property="og:site_name" content="ERSIYAN"/i,
  );
  assert.match(
    html,
    /https:\/\/ersiyan\.com\/images\/velsien-summit\/velsien-summit-social\.jpg/i,
  );
  assert.match(html, /teaser-title-640\.webp 640w/i);
  assert.match(html, /teaser-title-960\.webp 960w/i);
  assert.match(html, /name="twitter:card" content="summary_large_image"/i);
  assert.match(
    html,
    /name="twitter:image:alt" content="밝은 수직도시와 VELSIEN SUMMIT 로고, IN DEVELOPMENT 안내"/i,
  );
  assert.match(html, /현재 개발 중이며 출시 미정인 모바일 수집형 2D SRPG/);
  assert.match(html, /<h1[^>]*>[\s\S]*VELSIEN[\s\S]*SUMMIT[\s\S]*벨시엔 서밋[\s\S]*<\/h1>/i);
  assert.match(html, /IN DEVELOPMENT/);
  assert.match(html, /개발 중 · 출시 미정/);
  assert.match(html, /기술이 너무 잘 작동하는 도시/);
  assert.match(html, /어느 기업에도 속하지 않은 계약자/);
  assert.match(html, /실제 개발 화면/);
  assert.match(html, /벨시엔이라는 도시/);
  assert.match(html, /전투는 준비에서 갈립니다/);
  assert.match(html, /role="tablist" aria-label="개발 중 화면 선택"/i);
  assert.match(html, /role="tablist" aria-label="벨시엔 세계관 주제 선택"/i);
  assert.match(html, /role="tablist" aria-label="게임 진행 단계 선택"/i);
  assert.match(html, /aria-orientation="horizontal"/i);
  assert.match(html, /개발 중 타이틀 화면입니다/);
  assert.match(html, /이름과 개발 수치는 공개용 이미지에서 일부 흐리게 처리했습니다/);
  assert.equal(html.match(/role="tablist"/g)?.length ?? 0, 3);
  assert.equal(
    html.match(/id="scene-tab-(?:title|lobby|character)"/g)?.length ?? 0,
    3,
  );
  assert.equal(
    html.match(/id="world-tab-(?:city|corporations|contractor|companions)"/g)?.length ?? 0,
    4,
  );
  assert.equal(
    html.match(/id="play-tab-(?:contract|team|plan|battle)"/g)?.length ?? 0,
    4,
  );
  assert.match(
    html,
    /id="scene-tab-lobby"[^>]*aria-selected="true"[^>]*aria-controls="scene-panel-lobby"/i,
  );
  assert.equal(html.match(/loading="eager"/g)?.length ?? 0, 1);
  assert.doesNotMatch(html, /VelsienSignalDeck\.[^"']+\.css/i);
  for (const image of [
    "teaser-title.webp",
    "teaser-lobby.webp",
    "teaser-character.webp",
  ]) {
    assert.match(
      html,
      new RegExp(
        `<img\\b(?=[^>]*src="/images/velsien-summit/${image.replace(".", "\\.")}")(?=[^>]*alt="[^"]+")[^>]*>`,
        "i",
      ),
    );
  }
  assert.doesNotMatch(
    html,
    /RECEIVED TEXT|OPEN CHANNELS|PUBLIC SIGNALS|END OF PUBLIC RECORD|ABOUT THE TITLE|추가 데이터는 아직 공개되지 않았습니다/,
  );
  assert.doesNotMatch(
    html,
    /순수인간|평생계약|첫 계약|사전예약|출시일\s*20\d{2}|Lesia|Nael/,
  );
  assert.doesNotMatch(
    html,
    /Project8|QA\/Evidence|Client\/Assets|Unity|localhost:\d+|C:\\Users\\USER/i,
  );
});

test("server-renders the privacy policy", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>개인정보처리방침 \| 에르시안<\/title>/i);
  assert.match(html, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy"/i);
  assert.match(html, /회원가입과 문의 양식을 제공하지 않으며/);
  assert.match(html, /asoul122@naver\.com/);
  assert.match(html, /게임 앱 정책/);
  assert.match(html, /Workers Static Assets/);
  assert.match(html, /브랜드 및 공식 도메인 변경/);
  assert.match(html, /applepie\.im에서[\s\S]*ersiyan\.com으로 이전/);
  assert.match(html, /\/privacy\/archive\/2026-08-23/);
  assert.match(html, /href="\/privacy\/mine-logic"[^>]*>MINE LOGIC 개인정보처리방침 보기<\/a>/);
  assert.doesNotMatch(html, /`applepie\.im`/);
});

test("server-renders the MINE LOGIC privacy policy", async () => {
  const response = await render("/privacy/mine-logic");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>MINE LOGIC Privacy Policy \| 에르시안<\/title>/i);
  assert.match(html, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy\/mine-logic"/i);
  assert.match(html, /최초 시행일 2026년 7월 29일/);
  assert.match(html, /최근 변경일 및 시행일 2026년 8월\s*28일/);
  assert.match(html, /강화훈련에서 이미 제공한 문제의 이력/);
  assert.match(html, /결과 카드 이미지는 이용자의 기기에서 생성됩니다/);
  assert.match(html, /Android의 INTERNET 권한을 요청하지 않으며/);
  assert.match(html, /Cloudflare가 IP 주소와 접속 요청 정보를 처리할 수 있습니다/);
  assert.match(html, /MINE LOGIC Privacy Policy/);
  assert.match(html, /Last updated and effective August 28, 2026/);
  assert.match(html, /정책은 ersiyan\.com에서 제공합니다/);
  assert.match(html, /This policy is provided at ersiyan\.com/);
  assert.match(html, /cache\/shared_cards/);
  assert.match(html, /Children.s privacy/);
  assert.match(html, /강화훈련에서 이미 제공한 문제의\s*이력/);
  assert.match(html, /선택에 따른 완료 날짜가\s*포함될 수 있습니다/);
  assert.match(html, /history of problems already offered in Enhanced Training/);
  assert.match(html, /when selected, a completion date/);
  assert.doesNotMatch(html, /완료 일시|completion date and time/);
  assert.match(html, /represented by(?:<!-- -->)? (?:<!-- -->)?탁진(?:<!-- -->)?\./);
  assert.doesNotMatch(html, /represented by(?:<!-- -->)?탁진/);
  assert.doesNotMatch(
    html,
    /게임 진행에 필요한 상태|중단한 지점에서 계속|애플파이 \(애플파이\)/,
  );
  assert.match(html, /아동의 개인정보/);
  assert.match(html, /role="group" aria-label="Privacy policy language"/);
  assert.match(html, /document\.documentElement\.lang="en"/);
  assert.match(html, /aria-controls="mine-logic-policy-ko" aria-pressed="false"/);
  assert.match(html, /aria-controls="mine-logic-policy-en" aria-pressed="true"/);
  assert.match(html, /<button[^>]*aria-controls="mine-logic-policy-ko"[^>]*>한국어<\/button>/);
  assert.match(html, /<button[^>]*aria-controls="mine-logic-policy-en"[^>]*>English<\/button>/);
  assert.match(html, /<noscript>/);
  assert.match(html, /href="#mine-logic-policy-ko"[^>]*>한국어 개인정보처리방침으로 이동<\/a>/);
  assert.match(html, /#mine-logic-policy-ko\[hidden\][\s\S]*?display:\s*block\s*!important/);
  assert.match(html, /id="mine-logic-policy-ko" lang="ko" hidden=""/);
  assert.match(html, /id="mine-logic-policy-en" lang="en"/);
  assert.doesNotMatch(html, /id="mine-logic-policy-en" lang="en" hidden/);
  assert.match(html, /href="\/"[^>]*>← 홈페이지로<\/a>/);
  assert.match(html, /href="\/privacy"[^>]*>사이트 개인정보처리방침<\/a>/);
  assert.doesNotMatch(html, /수집·저장·이용·공유하지|제3자 SDK 없음|삭제할 데이터 없음/);
});

test("server-renders the archived privacy policy", async () => {
  const response = await render("/privacy/archive/2026-08-22");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /개인정보처리방침 2026년 8월 22일 보관본/);
  assert.match(html, /사용하는 OpenAI Sites와 그 기반 서비스/);
  assert.match(html, /이 방침의 최초 시행일은 2026년 8월 22일입니다/);
  assert.doesNotMatch(html, /Cloudflare Workers Static Assets/);
});

test("server-renders the August 23 privacy policy archive", async () => {
  const response = await render("/privacy/archive/2026-08-23");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /개인정보처리방침 2026년 8월 23일 보관본/);
  assert.match(html, /홈페이지 호스팅 서비스 변경/);
  assert.match(html, /Cloudflare Workers Static Assets/);
  assert.match(html, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy\/archive\/2026-08-23"/i);
  assert.match(html, /name="robots" content="noindex, follow"/i);
});

test("required public images are present", async () => {
  const assets = [
    "../public/ersiyan-social-card.jpg",
    "../public/ersiyan-mark.svg",
    "../public/images/brand/ersiyan-logo.png",
    "../public/images/brand/ersiyan-logo-hero.webp",
    "../public/images/mine-logic/feature.png",
    "../public/images/mine-logic/icon.png",
    "../public/images/mine-logic/02_hint.png",
    "../public/images/mine-logic/03_training.png",
    "../public/images/mine-logic/06_lobby.png",
    "../public/images/velsien-summit/teaser-title-640.webp",
    "../public/images/velsien-summit/teaser-title-960.webp",
    "../public/images/velsien-summit/teaser-title.webp",
    "../public/images/velsien-summit/teaser-lobby-640.webp",
    "../public/images/velsien-summit/teaser-lobby-960.webp",
    "../public/images/velsien-summit/teaser-lobby.webp",
    "../public/images/velsien-summit/teaser-character-640.webp",
    "../public/images/velsien-summit/teaser-character-960.webp",
    "../public/images/velsien-summit/teaser-character.webp",
    "../public/images/velsien-summit/velsien-summit-social.jpg",
  ];

  await Promise.all(assets.map((asset) => access(new URL(asset, import.meta.url))));
});

test("source contains no starter preview dependency or private certificate data", async () => {
  const [
    page,
    layout,
    privacy,
    mineLogicPrivacy,
    mineLogicPrivacyContent,
    archivedPrivacy,
    gameShowcase,
    velsienPage,
    velsienSignalDeck,
    velsienStyles,
    studioAccordion,
    businessProfile,
    globalStyles,
    robots,
    sitemap,
    teaserPreparation,
    responsivePreparation,
  ] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/privacy/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/privacy/mine-logic/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/privacy/mine-logic/MineLogicPrivacyContent.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/privacy/archive/2026-08-22/page.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/_components/GameShowcase.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/velsien-summit/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/velsien-summit/VelsienSignalDeck.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/velsien-summit/page.module.css", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/_components/StudioAccordion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/business-profile.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8"),
    readFile(
      new URL("../scripts/prepare-velsien-teaser.mjs", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../scripts/prepare-velsien-responsive.mjs", import.meta.url),
      "utf8",
    ),
  ]);

  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /SkeletonPreview|codex-preview|Starter Project/);
  assert.match(privacy, /Workers Static Assets/);
  assert.match(privacy, /canonical:\s*"\/privacy"/);
  assert.match(mineLogicPrivacy, /canonical:\s*"\/privacy\/mine-logic"/);
  assert.match(mineLogicPrivacy, /businessProfile\.email/);
  assert.match(mineLogicPrivacyContent, /useState<PolicyLanguage>\("en"\)/);
  assert.match(mineLogicPrivacyContent, /document\.documentElement\.lang = language/);
  assert.match(mineLogicPrivacyContent, /document\.documentElement\.lang = "ko"/);
  assert.match(mineLogicPrivacyContent, /document\.documentElement\.lang="en"/);
  assert.match(mineLogicPrivacyContent, /aria-pressed=\{language === "ko"\}/);
  assert.match(mineLogicPrivacyContent, /aria-pressed=\{language === "en"\}/);
  assert.match(mineLogicPrivacyContent, /lang="ko" hidden=\{language !== "ko"\}/);
  assert.match(mineLogicPrivacyContent, /lang="en" hidden=\{language !== "en"\}/);
  assert.match(mineLogicPrivacyContent, /cache\/shared_cards/);
  assert.match(mineLogicPrivacyContent, /강화훈련에서 이미 제공한 문제의/);
  assert.match(mineLogicPrivacyContent, /when selected, a[\s\S]*?completion date\./);
  assert.doesNotMatch(mineLogicPrivacyContent, /완료 일시|completion date and time/);
  assert.match(mineLogicPrivacyContent, /represented by \{representative\}/);
  assert.doesNotMatch(
    mineLogicPrivacyContent,
    /게임 진행에 필요한 상태|중단한 지점에서 계속|\{businessName\} \(애플파이\)/,
  );
  assert.match(mineLogicPrivacyContent, /<noscript>/);
  assert.match(mineLogicPrivacyContent, /href="#mine-logic-policy-ko"/);
  assert.match(mineLogicPrivacyContent, /#mine-logic-policy-ko\[hidden\][\s\S]*?display: block !important/);
  assert.match(globalStyles, /\.policy-language-switcher button[\s\S]*?min-height:\s*44px/);
  assert.match(globalStyles, /\.logo-stage\s*\{[\s\S]*?color-scheme:\s*only light/);
  assert.match(
    globalStyles,
    /@media \(prefers-color-scheme:\s*dark\)[\s\S]*?\.logo-stage img\s*\{[\s\S]*?mix-blend-mode:\s*normal;[\s\S]*?filter:\s*none;/,
  );
  assert.match(globalStyles, /outline:\s*3px solid var\(--red-dark\)/);
  assert.match(globalStyles, /\.privacy-footer-links[\s\S]*?gap:\s*12px 22px/);
  assert.match(archivedPrivacy, /OpenAI Sites/);
  assert.match(gameShowcase, /role="tab"/);
  assert.match(gameShowcase, /ArrowRight/);
  assert.match(gameShowcase, /href="\/velsien-summit"/);
  assert.match(gameShowcase, /velsienScenes/);
  assert.match(gameShowcase, /worldFiles/);
  assert.match(gameShowcase, /teaser-lobby\.webp/);
  assert.match(gameShowcase, /teaser-character\.webp/);
  assert.match(velsienPage, /canonical:\s*"\/velsien-summit"/);
  assert.match(velsienPage, /teaser-title\.webp/);
  assert.match(velsienSignalDeck, /role="tab"/);
  assert.doesNotMatch(velsienSignalDeck, /page\.module\.css/);
  assert.match(velsienPage, /signalDeckClasses/);
  assert.match(velsienSignalDeck, /aria-selected=\{isActive\}/);
  assert.match(velsienSignalDeck, /ArrowRight/);
  assert.match(velsienSignalDeck, /Home/);
  assert.match(velsienSignalDeck, /End/);
  assert.match(velsienSignalDeck, /aria-label="개발 중 화면 선택"/);
  assert.match(velsienSignalDeck, /aria-label="벨시엔 세계관 주제 선택"/);
  assert.match(velsienSignalDeck, /aria-label="게임 진행 단계 선택"/);
  assert.match(velsienSignalDeck, /teaser-lobby\.webp/);
  assert.match(velsienSignalDeck, /teaser-character\.webp/);
  assert.match(
    velsienSignalDeck,
    /const canonicalUrl = "https:\/\/ersiyan\.com\/velsien-summit"/,
  );
  assert.match(velsienSignalDeck, /만들고 있는 모바일 수집형 2D SRPG/);
  assert.match(velsienStyles, /100svh/);
  assert.match(velsienStyles, /prefers-reduced-motion:\s*reduce/);
  assert.match(velsienStyles, /min-height:\s*48px/);
  assert.match(velsienStyles, /\.summitNav a[\s\S]*?min-width:\s*44px/);
  assert.doesNotMatch(
    velsienPage + "\n" + velsienSignalDeck,
    /Project8|QA\/Evidence|Client\/Assets|순수인간|평생계약|첫 계약|Lesia|Nael/,
  );
  assert.match(robots, /Sitemap:\s*https:\/\/ersiyan\.com\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/ersiyan\.com\/velsien-summit/);
  assert.match(teaserPreparation, /teaser-title\.webp/);
  assert.match(responsivePreparation, /id: "teaser-title"/);
  assert.match(responsivePreparation, /width: 640/);
  assert.match(responsivePreparation, /width: 960/);
  assert.match(responsivePreparation, /teaser-lobby/);
  assert.match(responsivePreparation, /teaser-character/);
  assert.match(responsivePreparation, /privateRegions/);
  assert.match(responsivePreparation, /\.blur\(28\)/);
  assert.match(responsivePreparation, /sourceHash/);
  assert.match(studioAccordion, /aria-expanded=\{isOpen\}/);
  assert.match(page, /id="business-info"/);
  assert.match(page, /businessProfile\.phone/);
  assert.doesNotMatch(page, /사업자정보 ?확인|<dt>업태<\/dt>|<dt>종목<\/dt>/);
  assert.doesNotMatch(
    `${page}\n${businessProfile}`,
    privateDocumentDataPattern,
  );
});

import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const client = new URL("../dist/client/", import.meta.url);
const htmlFormattingGap =
  String.raw`(?:\s|&nbsp;|&#(?:32|x20);|<!--[\s\S]*?-->|<[^>]+>)+`;
const forbiddenErsiyanGameStudioPatterns = [
  new RegExp(String.raw`에르시안${htmlFormattingGap}게임${htmlFormattingGap}스튜디오`, "i"),
  new RegExp(String.raw`\bERSIYAN${htmlFormattingGap}GAME${htmlFormattingGap}STUDIO\b`, "i"),
];
const homepageHeroPattern =
  /<h1\b(?=[^>]*\bid=["']hero-title["'])[^>]*>(?:\s|<!--[\s\S]*?-->)*제가 좋아하는 인디 게임을(?:\s|<!--[\s\S]*?-->)*<br\s*\/?>(?:\s|<!--[\s\S]*?-->)*<span\b[^>]*>(?:\s|<!--[\s\S]*?-->)*직접 만들고(?:\s|<!--[\s\S]*?-->)*<\/span>(?:\s|<!--[\s\S]*?-->)*<br\s*\/?>(?:\s|<!--[\s\S]*?-->)*끝까지 운영합니다\.(?:\s|<!--[\s\S]*?-->)*<\/h1>/i;

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), "utf8"));
}

test("Cloudflare deployment is static-assets only", async () => {
  const config = await readJson("wrangler.cloudflare.jsonc");

  assert.equal(config.name, "ersiyan-com-static");
  assert.equal(config.workers_dev, true);
  assert.equal(config.preview_urls, false);
  assert.equal(config.assets?.directory, "./dist/client");
  assert.equal(config.assets?.not_found_handling, "404-page");
  assert.equal(config.assets?.html_handling, "auto-trailing-slash");
  assert.equal("main" in config, false);
  assert.deepEqual(config.routes, [
    {
      pattern: "ersiyan.com",
      custom_domain: true,
    },
  ]);
  assert.equal("route" in config, false);
  assert.equal("binding" in config.assets, false);
  assert.equal("run_worker_first" in config.assets, false);
});

test("Cloudflare asset directory contains every public route", async () => {
  await Promise.all(
    [
      "index.html",
      "mine-logic.html",
      "velsien-summit.html",
      "velsien-summit/late-update.html",
      "velsien-summit/secret.html",
      "privacy.html",
      "privacy/mine-logic.html",
      "privacy/archive/2026-08-22.html",
      "privacy/archive/2026-08-23.html",
      "privacy/archive/2026-08-28.html",
      "404.html",
      "_headers",
      "robots.txt",
      "sitemap.xml",
      "llms.txt",
      "ersiyan-social-card.jpg",
      "ersiyan-mark.svg",
      "images/brand/ersiyan-logo.png",
      "images/brand/ersiyan-logo-hero.webp",
      "images/mine-logic/feature.png",
      "images/mine-logic/feature-480.webp",
      "images/mine-logic/feature-768.webp",
      "images/mine-logic/feature-1024.webp",
      "images/mine-logic/icon.png",
      "images/mine-logic/icon-96.webp",
      "images/mine-logic/icon-144.webp",
      "images/mine-logic/icon-192.webp",
      "images/mine-logic/02_hint.png",
      "images/mine-logic/02_hint-360.webp",
      "images/mine-logic/02_hint-540.webp",
      "images/mine-logic/02_hint-720.webp",
      "images/mine-logic/03_training.png",
      "images/mine-logic/03_training-360.webp",
      "images/mine-logic/03_training-540.webp",
      "images/mine-logic/03_training-720.webp",
      "images/mine-logic/06_lobby.png",
      "images/mine-logic/06_lobby-360.webp",
      "images/mine-logic/06_lobby-540.webp",
      "images/mine-logic/06_lobby-720.webp",
      "images/velsien-summit/teaser-title-640.webp",
      "images/velsien-summit/teaser-title-960.webp",
      "images/velsien-summit/teaser-title.webp",
      "images/velsien-summit/teaser-lobby-640.webp",
      "images/velsien-summit/teaser-lobby-960.webp",
      "images/velsien-summit/teaser-lobby.webp",
      "images/velsien-summit/teaser-character-640.webp",
      "images/velsien-summit/teaser-character-960.webp",
      "images/velsien-summit/teaser-character.webp",
      "images/velsien-summit/velsien-summit-social.jpg",
      "images/velsien-summit/late-update-operation.webp",
      "images/velsien-summit/late-update-gacha.webp",
      "images/velsien-summit/late-update-formation.webp",
      "images/velsien-summit/secret/nika-oren.webp",
      "images/velsien-summit/secret/luena-havel.webp",
      "images/velsien-summit/secret/serin-noer.webp",
      "images/velsien-summit/secret/pia-morel.webp",
      "images/velsien-summit/secret/kael-droen.webp",
      "images/velsien-summit/secret/battle-shaped-charge.webp",
      "images/velsien-summit/secret/battle-prism-orbits.webp",
      "images/velsien-summit/secret/battle-percussion-rings.webp",
    ].map((file) =>
      access(new URL(file, client)),
    ),
  );

  const [homepage, mineLogic, velsienSummit, velsienLateUpdate, velsienSecret, privacyPolicy, mineLogicPrivacyPolicy, archivedPrivacyPolicy, archivedPrivacyPolicy20260823, archivedPrivacyPolicy20260828, notFound, headers, robots, sitemap, llms] = await Promise.all([
    readFile(new URL("index.html", client), "utf8"),
    readFile(new URL("mine-logic.html", client), "utf8"),
    readFile(new URL("velsien-summit.html", client), "utf8"),
    readFile(new URL("velsien-summit/late-update.html", client), "utf8"),
    readFile(new URL("velsien-summit/secret.html", client), "utf8"),
    readFile(new URL("privacy.html", client), "utf8"),
    readFile(new URL("privacy/mine-logic.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-22.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-23.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-28.html", client), "utf8"),
    readFile(new URL("404.html", client), "utf8"),
    readFile(new URL("_headers", client), "utf8"),
    readFile(new URL("robots.txt", client), "utf8"),
    readFile(new URL("sitemap.xml", client), "utf8"),
    readFile(new URL("llms.txt", client), "utf8"),
  ]);

  assert.match(homepage, /<html[^>]*lang="ko"/i);
  assert.match(
    homepage,
    /<title>에르시안 \| MINE LOGIC·VELSIEN SUMMIT 인디 게임 스튜디오<\/title>/i,
  );
  assert.match(
    homepage,
    /<meta property="og:title" content="에르시안 \| ERSIYAN"\/>/i,
  );
  assert.match(
    homepage,
    /<meta name="twitter:title" content="에르시안 \| ERSIYAN"\/>/i,
  );
  assert.match(homepage, /ersiyan-social-card\.jpg/i);
  assert.match(homepage, /ersiyan-logo-hero\.webp/i);
  assert.match(homepage, /"@type":"WebPage"/);
  assert.match(homepage, /"email":"help@ersiyan\.com"/);
  assert.match(homepage, homepageHeroPattern);
  assert.match(homepage, /href="\/mine-logic"/i);
  assert.match(homepage, /feature-480\.webp 480w/i);
  assert.match(homepage, /06_lobby-360\.webp 360w/i);
  assert.doesNotMatch(
    homepage,
    /src="\/images\/mine-logic\/(?:02_hint|03_training)\.png"/i,
  );
  assert.match(homepage, /게임제작업자 등록번호/);
  assert.match(homepage, /제2026-000002호/);
  assert.match(homepage, /개인사업자 에르시안이 운영하는 공식 홈페이지입니다/);
  assert.match(homepage, /aria-label="에르시안 법정 사업자 정보"/);
  assert.doesNotMatch(homepage, /ERSIYAN은 애플파이가 운영하는 브랜드입니다/);
  assert.match(
    mineLogic,
    /<title>MINE LOGIC \| 단계별 힌트와 20단계 훈련이 있는 지뢰찾기 게임<\/title>/i,
  );
  assert.match(
    mineLogic,
    /rel="canonical" href="https:\/\/ersiyan\.com\/mine-logic"/i,
  );
  assert.match(mineLogic, /"@type":\["VideoGame","MobileApplication"\]/);
  assert.match(mineLogic, /"softwareVersion":"1\.3\.3"/);
  assert.match(mineLogic, /"identifier":"com\.applepie\.minelogic"/);
  assert.match(mineLogic, /"priceCurrency":"KRW"/);
  assert.match(mineLogic, /9 × 9 · 지뢰 10개/);
  assert.match(mineLogic, /16 × 16 · 지뢰 40개/);
  assert.match(mineLogic, /30 × 16 · 지뢰 99개/);
  assert.match(mineLogic, /일반훈련 1~15단계/);
  assert.match(mineLogic, /강화훈련 16~20단계/);
  assert.match(mineLogic, /Android INTERNET 권한을 요청하지 않습니다/);
  assert.match(mineLogic, /feature-480\.webp 480w/i);
  assert.match(mineLogic, /feature-1024\.webp 1024w/i);
  assert.match(mineLogic, /02_hint-360\.webp 360w/i);
  assert.match(mineLogic, /03_training-720\.webp 720w/i);
  assert.match(mineLogic, /"offers":\{"@type":"Offer","url":"https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.applepie\.minelogic","price":0,"priceCurrency":"KRW","availability":"https:\/\/schema\.org\/InStock"\}/);
  assert.doesNotMatch(mineLogic, /"aggregateRating"|"review"/);
  assert.match(
    velsienSummit,
    /<title>VELSIEN SUMMIT\(벨시엔 서밋\) \| 모바일 수집형 2D SRPG<\/title>/i,
  );
  assert.match(velsienSummit, /rel="canonical" href="https:\/\/ersiyan\.com\/velsien-summit"/i);
  assert.match(velsienSummit, /property="og:url" content="https:\/\/ersiyan\.com\/velsien-summit"/i);
  assert.match(velsienSummit, /images\/velsien-summit\/velsien-summit-social\.jpg/i);
  assert.match(velsienSummit, /"@id":"https:\/\/ersiyan\.com\/velsien-summit#game"/);
  assert.match(velsienSummit, /"creativeWorkStatus":"In Development"/);
  assert.match(velsienSummit, /teaser-title-640\.webp 640w/i);
  assert.match(velsienSummit, /teaser-title-960\.webp 960w/i);
  assert.match(velsienSummit, /teaser-lobby-640\.webp 640w/i);
  assert.match(velsienSummit, /teaser-character-640\.webp 640w/i);
  assert.doesNotMatch(velsienSummit, /VelsienSignalDeck\.[^"']+\.css/i);
  assert.match(velsienSummit, /href="\/velsien-summit\/late-update"/i);
  assert.match(velsienLateUpdate, /8월말 추가정보/);
  assert.match(
    velsienLateUpdate,
    /rel="canonical" href="https:\/\/ersiyan\.com\/velsien-summit\/late-update"/i,
  );
  assert.match(velsienLateUpdate, /late-update-operation\.webp/i);
  assert.match(velsienLateUpdate, /late-update-gacha\.webp/i);
  assert.match(velsienLateUpdate, /late-update-formation\.webp/i);
  assert.match(velsienSecret, /Secret Archive/);
  assert.match(velsienSecret, /images\/velsien-summit\/secret\/nika-oren\.webp/i);
  assert.match(velsienSecret, /images\/velsien-summit\/secret\/battle-percussion-rings\.webp/i);
  assert.doesNotMatch(velsienSecret, /name="robots" content="[^"]*noindex/i);
  assert.doesNotMatch(homepage, /href="\/velsien-summit\/secret"/i);
  assert.doesNotMatch(velsienSummit, /href="\/velsien-summit\/secret"/i);
  assert.doesNotMatch(velsienLateUpdate, /href="\/velsien-summit\/secret"/i);
  assert.equal(
    homepage.match(/<a\b[^>]*href="\/velsien-summit"[^>]*>/gi)?.length ?? 0,
    1,
  );
  assert.match(homepage, /OUR GAMES · 01/);
  assert.match(homepage, /WORLD FILE \/\/ PUBLIC ACCESS 03%/);
  assert.match(homepage, /도시의 정상으로 향하는 계약/);
  assert.match(homepage, /어느 기업에도 묶이지 않은 계약자/);
  assert.match(homepage, /세 개의 기업 채널/);
  assert.equal(
    homepage.match(/id="game-tab-(?:mine-logic|velsien)"/g)?.length ?? 0,
    2,
  );
  assert.equal(
    homepage.match(/id="velsien-scene-(?:title|lobby|character)"/g)?.length ?? 0,
    3,
  );
  for (const image of [
    "teaser-title.webp",
    "teaser-lobby.webp",
    "teaser-character.webp",
  ]) {
    assert.match(homepage, new RegExp(`images/velsien-summit/${image.replace(".", "\\.")}`, "i"));
    assert.match(
      velsienSummit,
      new RegExp(`images/velsien-summit/${image.replace(".", "\\.")}`, "i"),
    );
  }
  assert.match(privacyPolicy, /<title>개인정보처리방침 \| 에르시안<\/title>/i);
  assert.match(privacyPolicy, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy"/i);
  assert.match(privacyPolicy, /사업자명 변경/);
  assert.match(privacyPolicy, /개인사업자 에르시안\(대표자 탁진/);
  assert.match(privacyPolicy, /\/privacy\/archive\/2026-08-28/);
  assert.match(mineLogicPrivacyPolicy, /<title>MINE LOGIC Privacy Policy \| 에르시안<\/title>/i);
  assert.match(mineLogicPrivacyPolicy, /https:\/\/ersiyan\.com\/privacy\/mine-logic/i);
  assert.match(mineLogicPrivacyPolicy, /MINE LOGIC Privacy Policy/);
  assert.match(mineLogicPrivacyPolicy, /document\.documentElement\.lang="en"/);
  assert.match(mineLogicPrivacyPolicy, /aria-controls="mine-logic-policy-en" aria-pressed="true"/);
  assert.match(mineLogicPrivacyPolicy, /aria-controls="mine-logic-policy-ko" aria-pressed="false"/);
  assert.match(mineLogicPrivacyPolicy, /<noscript>/);
  assert.match(mineLogicPrivacyPolicy, /href="#mine-logic-policy-ko"[^>]*>한국어 개인정보처리방침으로 이동<\/a>/);
  assert.match(mineLogicPrivacyPolicy, /#mine-logic-policy-ko\[hidden\][\s\S]*?display:\s*block\s*!important/);
  assert.match(mineLogicPrivacyPolicy, /id="mine-logic-policy-ko" lang="ko" hidden=""/);
  assert.match(mineLogicPrivacyPolicy, /id="mine-logic-policy-en" lang="en"/);
  assert.match(mineLogicPrivacyPolicy, /cache\/shared_cards/);
  assert.match(mineLogicPrivacyPolicy, /Children.s privacy/);
  assert.match(mineLogicPrivacyPolicy, /강화훈련에서 이미 제공한 문제의\s*이력/);
  assert.match(mineLogicPrivacyPolicy, /선택에 따른 완료 날짜가\s*포함될 수 있습니다/);
  assert.match(mineLogicPrivacyPolicy, /history of problems already offered in Enhanced Training/);
  assert.match(mineLogicPrivacyPolicy, /when selected, a completion date/);
  assert.match(mineLogicPrivacyPolicy, /Last updated and effective August 31, 2026/);
  assert.match(mineLogicPrivacyPolicy, /상호가 애플파이에서[\s\S]*에르시안으로 변경/);
  assert.doesNotMatch(mineLogicPrivacyPolicy, /완료 일시|completion date and time/);
  assert.match(
    mineLogicPrivacyPolicy,
    /represented by(?:<!-- -->)? (?:<!-- -->)?탁진(?:<!-- -->)?\./,
  );
  assert.doesNotMatch(mineLogicPrivacyPolicy, /represented by(?:<!-- -->)?탁진/);
  assert.doesNotMatch(mineLogicPrivacyPolicy, /애플파이 \(애플파이\)/);
  assert.match(archivedPrivacyPolicy, /<title>개인정보처리방침 2026년 8월 22일 보관본 \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy20260823, /<title>개인정보처리방침 2026년 8월 23일 보관본 \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy20260828, /<title>개인정보처리방침 2026년 8월 28일 보관본 \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy20260828, /개인사업자 애플파이/);
  assert.match(notFound, /<title>에르시안<\/title>/i);
  assert.match(headers, /Strict-Transport-Security:\s*max-age=31536000/i);
  assert.match(headers, /Content-Security-Policy:[^\r\n]*frame-ancestors 'none'/i);
  assert.match(headers, /X-Content-Type-Options:\s*nosniff/i);
  assert.match(robots, /Sitemap:\s*https:\/\/ersiyan\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/mine-logic<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit\/late-update<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit\/secret<\/loc>/);
  assert.deepEqual(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]),
    [
      "https://ersiyan.com/",
      "https://ersiyan.com/mine-logic",
      "https://ersiyan.com/velsien-summit",
      "https://ersiyan.com/velsien-summit/late-update",
      "https://ersiyan.com/velsien-summit/secret",
      "https://ersiyan.com/privacy",
      "https://ersiyan.com/privacy/mine-logic",
    ],
  );
  assert.doesNotMatch(sitemap, /\/privacy\/archive\//);
  assert.match(llms, /https:\/\/ersiyan\.com\/mine-logic/);
  assert.match(llms, /com\.applepie\.minelogic/);

  for (const html of [homepage, mineLogic, velsienSummit, velsienLateUpdate, velsienSecret, privacyPolicy, mineLogicPrivacyPolicy, archivedPrivacyPolicy, archivedPrivacyPolicy20260823, archivedPrivacyPolicy20260828, notFound]) {
    assert.doesNotMatch(html, /dist\/server|server\/index\.js|\/_worker\.js/i);
    for (const forbiddenPattern of forbiddenErsiyanGameStudioPatterns) {
      assert.doesNotMatch(html, forbiddenPattern);
    }
  }

  assert.doesNotMatch(
    velsienSummit,
    /Project8|QA\/Evidence|Client\/Assets|순수인간|평생계약|Lesia|Nael|ABOUT THE TITLE|추가 데이터는 아직 공개되지 않았습니다/,
  );
});

test("every local image, stylesheet, and script referenced by HTML exists", async () => {
  const pages = await Promise.all(
    ["index.html", "mine-logic.html", "velsien-summit.html", "velsien-summit/late-update.html", "velsien-summit/secret.html", "privacy.html", "privacy/mine-logic.html", "privacy/archive/2026-08-22.html", "privacy/archive/2026-08-23.html", "privacy/archive/2026-08-28.html", "404.html"].map((file) =>
      readFile(new URL(file, client), "utf8"),
    ),
  );
  const assetPaths = new Set();

  for (const html of pages) {
    for (const match of html.matchAll(/<(?:img|script|link)\b[^>]*?\b(?:src|href)=["']([^"']+)["']/gi)) {
      const value = match[1];
      if (value.startsWith("/") && !value.startsWith("//")) {
        assetPaths.add(value.split(/[?#]/, 1)[0]);
      }
    }
  }

  assert.ok(assetPaths.size > 0);
  await Promise.all(
    [...assetPaths].map((pathname) => access(new URL(`.${pathname}`, client))),
  );
});

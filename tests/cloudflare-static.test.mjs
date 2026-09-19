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
  /<h1\b[^>]*class="home-page-title"[^>]*>에르시안\(ERSIYAN\) · 게임 개발과 운영<\/h1>/i;

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), "utf8"));
}

function assertCommonFooter(html, pathname) {
  const footers = [...html.matchAll(
    /<footer\b[^>]*\bdata-er-footer(?:="true")?[^>]*>[\s\S]*?<\/footer>/gi,
  )].map(([footer]) => footer);
  assert.equal(footers.length, 1, `${pathname} renders exactly one common footer`);
  const [footer] = footers;
  assert.match(footer, /aria-label="에르시안 사업자 정보"/i);
  assert.match(footer, /<dt>대표자<\/dt>[\s\S]*?<dd>탁진<\/dd>/i);
  assert.doesNotMatch(footer, /박진/);
  assert.match(html, /<[^>]*\bid="top"[^>]*>/i, `${pathname} has a #top target`);
  assert.match(footer, /<a\b[^>]*href="#top"[^>]*data-er-back-top(?:="true")?[^>]*>/i);
  assert.match(footer, /<details\b[^>]*\bdata-er-details(?:="true")?[^>]*>/i);
  assert.match(footer, /<summary\b[^>]*>[\s\S]*?사업자 상세 정보[\s\S]*?<\/summary>/i);
  for (const href of ["/privacy", "/privacy/mine-logic", "#top"]) {
    assert.match(footer, new RegExp(`href="${href.replace("#", "\\#")}"`, "i"),
      `${pathname} footer keeps ${href}`);
  }
  assert.match(footer, /href="mailto:help@ersiyan\.com"/i);
  assert.match(footer, /href="tel:\+821024166267"/i);
  assert.match(
    footer,
    /href="https:\/\/www\.ftc\.go\.kr\/bizCommPop\.do\?wrkr_no=2064362580"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/i,
  );
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
      "virtual.html",
      "mine-logic.html",
      "velsien-summit.html",
      "velsien-summit/world.html",
      "velsien-summit/corporate/orysen.html",
      "velsien-summit/corporate/virenta.html",
      "velsien-summit/corporate/neryx.html",
      "velsien-summit/late-update.html",
      "velsien-summit/secret.html",
      "privacy.html",
      "privacy/mine-logic.html",
      "privacy/archive/2026-08-22.html",
      "privacy/archive/2026-08-23.html",
      "privacy/archive/2026-08-28.html",
      "privacy/archive/2026-08-31.html",
      "privacy/archive/2026-09-05.html",
      "404.html",
      "_headers",
      "_redirects",
      "robots.txt",
      "sitemap.xml",
      "llms.txt",
      "ersiyan-social-card.jpg",
      "ersiyan-mark.svg",
      "favicon.ico",
      "favicon-192.png",
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
      "images/velsien-summit/devlog-20260905-city-640.webp",
      "images/velsien-summit/devlog-20260905-city-960.webp",
      "images/velsien-summit/devlog-20260905-city-1600.webp",
      "images/velsien-summit/devlog-20260905-sunlit-640.webp",
      "images/velsien-summit/devlog-20260905-sunlit-960.webp",
      "images/velsien-summit/devlog-20260905-sunlit-1440.webp",
      "images/velsien-summit/devlog-20260905-luena-360.webp",
      "images/velsien-summit/devlog-20260905-luena-540.webp",
      "images/velsien-summit/devlog-20260905-luena-720.webp",
      "images/velsien-summit/devlog-20260905-lesia-360.webp",
      "images/velsien-summit/devlog-20260905-lesia-540.webp",
      "images/velsien-summit/devlog-20260905-lesia-720.webp",
      "images/velsien-summit/devlog-20260905-serin-360.webp",
      "images/velsien-summit/devlog-20260905-serin-540.webp",
      "images/velsien-summit/devlog-20260905-serin-720.webp",
      "images/velsien-summit/devlog-20260905-battle-01-640.webp",
      "images/velsien-summit/devlog-20260905-battle-01-960.webp",
      "images/velsien-summit/devlog-20260905-battle-01-1920.webp",
      "images/velsien-summit/devlog-20260905-battle-02-640.webp",
      "images/velsien-summit/devlog-20260905-battle-02-960.webp",
      "images/velsien-summit/devlog-20260905-battle-02-1920.webp",
      "images/velsien-summit/teaser-lobby-640.webp",
      "images/velsien-summit/teaser-lobby-960.webp",
      "images/velsien-summit/teaser-lobby.webp",
      "images/velsien-summit/teaser-character-640.webp",
      "images/velsien-summit/teaser-character-960.webp",
      "images/velsien-summit/teaser-character.webp",
      "images/velsien-summit/velsien-summit-social.jpg",
      "images/velsien-summit/late-update-operation.webp",
      "images/velsien-summit/late-update-operation-400.webp",
      "images/velsien-summit/late-update-operation-640.webp",
      "images/velsien-summit/late-update-gacha.webp",
      "images/velsien-summit/late-update-gacha-400.webp",
      "images/velsien-summit/late-update-gacha-640.webp",
      "images/velsien-summit/late-update-formation.webp",
      "images/velsien-summit/late-update-formation-400.webp",
      "images/velsien-summit/late-update-formation-640.webp",
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

  const [homepage, virtual, mineLogic, velsienSummit, velsienWorld, velsienLateUpdate, velsienSecret, privacyPolicy, mineLogicPrivacyPolicy, archivedPrivacyPolicy, archivedPrivacyPolicy20260823, archivedPrivacyPolicy20260828, archivedPrivacyPolicy20260831, archivedPrivacyPolicy20260905, notFound, headers, robots, sitemap, llms] = await Promise.all([
    readFile(new URL("index.html", client), "utf8"),
    readFile(new URL("virtual.html", client), "utf8"),
    readFile(new URL("mine-logic.html", client), "utf8"),
    readFile(new URL("velsien-summit.html", client), "utf8"),
    readFile(new URL("velsien-summit/world.html", client), "utf8"),
    readFile(new URL("velsien-summit/late-update.html", client), "utf8"),
    readFile(new URL("velsien-summit/secret.html", client), "utf8"),
    readFile(new URL("privacy.html", client), "utf8"),
    readFile(new URL("privacy/mine-logic.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-22.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-23.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-28.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-31.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-09-05.html", client), "utf8"),
    readFile(new URL("404.html", client), "utf8"),
    readFile(new URL("_headers", client), "utf8"),
    readFile(new URL("robots.txt", client), "utf8"),
    readFile(new URL("sitemap.xml", client), "utf8"),
    readFile(new URL("llms.txt", client), "utf8"),
  ]);

  for (const [pathname, html] of [
    ["/", homepage],
    ["/virtual", virtual],
    ["/mine-logic", mineLogic],
    ["/privacy", privacyPolicy],
    ["/privacy/mine-logic", mineLogicPrivacyPolicy],
    ["/privacy/archive/2026-08-22", archivedPrivacyPolicy],
    ["/privacy/archive/2026-08-23", archivedPrivacyPolicy20260823],
    ["/privacy/archive/2026-08-28", archivedPrivacyPolicy20260828],
    ["/privacy/archive/2026-08-31", archivedPrivacyPolicy20260831],
    ["/privacy/archive/2026-09-05", archivedPrivacyPolicy20260905],
    ["/velsien-summit", velsienSummit],
    ["/velsien-summit/world", velsienWorld],
    ["/velsien-summit/late-update", velsienLateUpdate],
    ["/velsien-summit/secret", velsienSecret],
  ]) {
    assertCommonFooter(html, pathname);
  }

  assert.match(homepage, /<html[^>]*lang="ko"/i);
  assert.match(
    homepage,
    /<title>에르시안\(ERSIYAN\) · 게임 개발과 운영<\/title>/i,
  );
  assert.match(
    homepage,
    /<meta property="og:title" content="에르시안\(ERSIYAN\) · 게임 개발과 운영"\/>/i,
  );
  assert.match(
    homepage,
    /<meta name="twitter:title" content="에르시안\(ERSIYAN\) · 게임 개발과 운영"\/>/i,
  );
  assert.match(homepage, /ersiyan-social-card\.jpg/i);
  assert.match(homepage, /ersiyan-logo-hero\.webp/i);
  assert.match(homepage, /"@type":"WebPage"/);
  assert.match(homepage, /"email":"help@ersiyan\.com"/);
  assert.match(homepage, homepageHeroPattern);
  assert.match(homepage, /href="\/mine-logic"/i);
  assert.match(homepage, /<a\b(?=[^>]*id="ersiyan-virtual-tab")(?=[^>]*href="\/virtual")[^>]*>/i);
  assert.doesNotMatch(homepage, /<section\b[^>]*id="ersiyan-virtual-view"/i);
  assert.match(virtual, /<a\b(?=[^>]*id="ersiyan-games-tab")(?=[^>]*href="\/")[^>]*>/i);
  assert.match(virtual, /<a\b(?=[^>]*id="ersiyan-virtual-tab")(?=[^>]*aria-current="page")[^>]*>/i);
  assert.match(virtual, /<section\b[^>]*id="ersiyan-virtual-view"/i);
  assert.doesNotMatch(virtual, /<section\b[^>]*id="ersiyan-games-view"/i);
  assert.match(virtual, /rel="canonical" href="https:\/\/ersiyan\.com\/virtual"/i);
  assert.match(virtual, /첫 소속 크리에이터 지원 접수 중/);
  assert.match(virtual, /href="#virtual-apply"/);
  assert.match(virtual, /href="mailto:biz@ersiyan\.com\?subject=[^"]+"/);
  assert.match(virtual, /<section\b[^>]*id="virtual-apply"[^>]*>[\s\S]*?href="\/privacy"[\s\S]*?<\/section>/i);
  assert.match(virtual, /id="ersiyan-company-view"/);
  assert.match(virtual, /id="business-info"/);
  assert.doesNotMatch(virtual, /href="\/velsien-summit\/secret"/i);
  assert.match(homepage, /feature-480\.webp 480w/i);
  assert.match(homepage, /06_lobby-360\.webp 360w/i);
  assert.doesNotMatch(
    homepage,
    /src="\/images\/mine-logic\/(?:02_hint|03_training)\.png"/i,
  );
  assert.match(homepage, /게임제작업자 등록번호/);
  assert.match(homepage, /제2026-000002호/);
  assert.match(homepage, /개인사업자 에르시안이 운영하는 공식 홈페이지입니다/);
  assert.match(homepage, /aria-label="에르시안 사업자 정보"/);
  assert.doesNotMatch(homepage, /ERSIYAN은 애플파이가 운영하는 브랜드입니다/);
  assert.match(
    mineLogic,
    /<title>MINE LOGIC\(마인로직\) \| Android 오프라인 지뢰찾기 · 단계별 힌트 · 20단계 훈련<\/title>/i,
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
  assert.doesNotMatch(mineLogic, /\/_next\/static\/chunks\/link-[^"\s]+\.js/,
    "Static document links do not load the unsupported RSC prefetch client");
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
    /<title>VELSIEN SUMMIT\(벨시엔 서밋\) \| 모바일 캐릭터 수집형 전략 RPG<\/title>/i,
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
  assert.match(velsienSummit, /href="\/velsien-summit\/world"/i);
  assert.match(velsienSummit, /href="\/velsien-summit\/late-update"/i);
  assert.match(velsienWorld, /rel="canonical" href="https:\/\/ersiyan\.com\/velsien-summit\/world"/i);
  assert.match(velsienWorld, /href="\/velsien-summit"/i);
  assert.doesNotMatch(velsienWorld, /name="robots" content="[^"]*\b(?:noindex|nofollow|none)\b/i);
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
  assert.match(homepage, /WORLD FILE \/\/ WORK IN PROGRESS/);
  assert.match(homepage, /아름답게 돌아가는 미래도시/);
  assert.match(velsienLateUpdate, /2026년 8월 말의 개발 기록입니다/);
  assert.match(velsienLateUpdate, /href="\/velsien-summit#development-log"/);
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
  assert.match(privacyPolicy, /href="\/privacy\/archive\/2026-08-31"/);
  assert.match(privacyPolicy, /href="\/privacy\/archive\/2026-09-05"/);
  assert.match(privacyPolicy, /최근 변경일 및 시행일 2026년 9월 19일/);
  assert.match(privacyPolicy, /최종 선정일로부터[\s\S]*?30일 이내에 삭제합니다/);
  assert.match(privacyPolicy, /선정 없이 모집을 취소하거나 종료하면[\s\S]*?30일 이내에 삭제합니다/);
  assert.match(privacyPolicy, /AI 학습이나 홍보 콘텐츠에[\s\S]*?재사용하지 않습니다/);
  assert.match(privacyPolicy, /Cloudflare Web Analytics/);
  assert.match(mineLogicPrivacyPolicy, /<title>MINE LOGIC Privacy Policy \| 에르시안<\/title>/i);
  assert.match(mineLogicPrivacyPolicy, /https:\/\/ersiyan\.com\/privacy\/mine-logic/i);
  assert.match(mineLogicPrivacyPolicy, /MINE LOGIC Privacy Policy/);
  assert.match(mineLogicPrivacyPolicy, /document\.documentElement\.lang="en-US"/);
  assert.match(mineLogicPrivacyPolicy, /aria-controls="mine-logic-policy-en" aria-pressed="true"/);
  assert.match(mineLogicPrivacyPolicy, /aria-controls="mine-logic-policy-ko" aria-pressed="false"/);
  assert.match(mineLogicPrivacyPolicy, /<noscript>/);
  assert.match(mineLogicPrivacyPolicy, /href="#mine-logic-policy-ko"[^>]*>한국어 개인정보처리방침으로 이동<\/a>/);
  assert.match(mineLogicPrivacyPolicy, /#mine-logic-policy-ko\[hidden\][\s\S]*?display:\s*block\s*!important/);
  assert.match(mineLogicPrivacyPolicy, /id="mine-logic-policy-ko" lang="ko-KR" hidden=""/);
  assert.match(mineLogicPrivacyPolicy, /id="mine-logic-policy-en" lang="en-US"/);
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
  assert.match(archivedPrivacyPolicy20260831, /<title>개인정보처리방침 2026년 8월 31일 보관본 \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy20260831, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy\/archive\/2026-08-31"/i);
  assert.match(archivedPrivacyPolicy20260905, /<title>개인정보처리방침 2026년 9월 5일 보관본 \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy20260905, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy\/archive\/2026-09-05"/i);
  assert.doesNotMatch(archivedPrivacyPolicy20260905, /최종 선정 후 30일 이내/);
  for (const archive of [archivedPrivacyPolicy, archivedPrivacyPolicy20260823, archivedPrivacyPolicy20260828, archivedPrivacyPolicy20260831, archivedPrivacyPolicy20260905]) {
    assert.match(archive, /name="robots" content="index, follow"/i);
  }
  assert.match(archivedPrivacyPolicy20260831, /사업자명 변경/);
  assert.match(archivedPrivacyPolicy20260831, /현재 홈페이지는 자체 광고 쿠키나 방문자 분석 도구를 사용하지 않습니다/);
  assert.match(notFound, /<title>에르시안<\/title>/i);
  assert.match(headers, /Strict-Transport-Security:\s*max-age=31536000/i);
  assert.match(headers, /Content-Security-Policy:[^\r\n]*frame-ancestors 'none'/i);
  assert.match(headers, /X-Content-Type-Options:\s*nosniff/i);
  assert.match(robots, /Sitemap:\s*https:\/\/ersiyan\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/mine-logic<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/virtual<\/loc>\s*<lastmod>2026-09-19<\/lastmod>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit\/world<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit\/world<\/loc>\s*<lastmod>2026-09-20<\/lastmod>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit\/late-update<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit\/secret<\/loc>/);
  assert.deepEqual(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort(),
    [
      "https://ersiyan.com/",
      "https://ersiyan.com/virtual",
      "https://ersiyan.com/mine-logic",
      "https://ersiyan.com/velsien-summit",
      "https://ersiyan.com/velsien-summit/corporate/orysen",
      "https://ersiyan.com/velsien-summit/corporate/virenta",
      "https://ersiyan.com/velsien-summit/corporate/neryx",
      "https://ersiyan.com/velsien-summit/world",
      "https://ersiyan.com/velsien-summit/late-update",
      "https://ersiyan.com/velsien-summit/secret",
      "https://ersiyan.com/privacy",
      "https://ersiyan.com/privacy/mine-logic",
      "https://ersiyan.com/privacy/archive/2026-08-22",
      "https://ersiyan.com/privacy/archive/2026-08-23",
      "https://ersiyan.com/privacy/archive/2026-08-28",
      "https://ersiyan.com/privacy/archive/2026-08-31",
      "https://ersiyan.com/privacy/archive/2026-09-05",
    ].sort(),
  );
  assert.equal(sitemap, await readFile(new URL("public/sitemap.xml", root), "utf8"),
    "Staged sitemap preserves the current source URLs and modification dates");
  for (const [, entry] of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const location = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const modificationDates = [...entry.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)];
    assert.equal(modificationDates.length, 1, `${location} has exactly one modification date`);
    const date = modificationDates[0][1];
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${location} uses an ISO calendar date`);
    const timestamp = Date.parse(`${date}T00:00:00.000Z`);
    assert.ok(Number.isFinite(timestamp), `${location} has a valid modification date`);
    assert.equal(new Date(timestamp).toISOString().slice(0, 10), date,
      `${location} has a real calendar date`);
  }
  assert.match(llms, /https:\/\/ersiyan\.com\/mine-logic/);
  assert.match(llms, /biz@ersiyan\.com/);
  assert.match(llms, /https:\/\/ersiyan\.com\/velsien-summit\/world/);
  assert.match(llms, /com\.applepie\.minelogic/);

  for (const html of [homepage, virtual, mineLogic, velsienSummit, velsienWorld, velsienLateUpdate, velsienSecret, privacyPolicy, mineLogicPrivacyPolicy, archivedPrivacyPolicy, archivedPrivacyPolicy20260823, archivedPrivacyPolicy20260828, archivedPrivacyPolicy20260831, notFound]) {
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

test("corporate static pages retain their own title and social identity", async () => {
  for (const [company, socialTitle] of [
    ["orysen", "ORYSEN | 오리센"],
    ["virenta", "VIRENTA | 비렌타"],
    ["neryx", "NERYX | 네릭스"],
  ]) {
    const html = await readFile(new URL(`velsien-summit/corporate/${company}.html`, client), "utf8");
    assert.doesNotMatch(html, /<footer\b[^>]*data-er-footer/i,
      `${company} keeps its footer-free corporate page intact`);
    assert.doesNotMatch(html, /id="business-info"|에르시안 사업자 정보|대표자<\/dt>/i,
      `${company} is excluded from the shared business footer`);
    assert.deepEqual(
      [...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map((match) => match[1]),
      [`${socialTitle} · 벨시엔 서밋`],
      `${company} uses its own title without the parent-site template`,
    );
    const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => tag);
    for (const [attribute, name, expected] of [
      ["property", "og:title", socialTitle],
      ["name", "twitter:title", socialTitle],
      ["property", "og:image", `https://ersiyan.com/${company}-logo.png`],
      ["name", "twitter:image", `https://ersiyan.com/${company}-logo.png`],
    ]) {
      const contents = metaTags
        .filter((tag) => tag.match(new RegExp(`\\b${attribute}=["']([^"']*)["']`, "i"))?.[1] === name)
        .map((tag) => tag.match(/\bcontent=["']([^"']*)["']/i)?.[1]);
      assert.deepEqual(contents, [expected], `${company} publishes exactly one current ${name}`);
    }
  }
});

test("every local image, responsive candidate, social image, stylesheet, and script exists", async () => {
  const pageFiles = ["index.html", "virtual.html", "mine-logic.html", "velsien-summit.html", "velsien-summit/world.html", "velsien-summit/late-update.html", "velsien-summit/secret.html", "privacy.html", "privacy/mine-logic.html", "privacy/archive/2026-08-22.html", "privacy/archive/2026-08-23.html", "privacy/archive/2026-08-28.html", "privacy/archive/2026-08-31.html", "privacy/archive/2026-09-05.html", "404.html"];
  const pages = await Promise.all(
    pageFiles.map((file) =>
      readFile(new URL(file, client), "utf8"),
    ),
  );
  const manifest = await readJson("dist/server/.vite/manifest.json");
  const entryKeys = Object.keys(manifest).filter((key) => manifest[key].isEntry);
  assert.ok(entryKeys.length > 0, "Build manifest identifies the shared entry");
  function requiredStyles(file) {
    const seen = new Set();
    const hrefs = new Set();
    function visit(key) {
      if (seen.has(key)) return;
      seen.add(key);
      assert.ok(manifest[key], `Build entry ${key} exists`);
      for (const css of manifest[key].css ?? []) hrefs.add(`/${css}`);
      for (const dependency of manifest[key].imports ?? []) visit(dependency);
    }
    entryKeys.forEach(visit);
    if (file !== "404.html") {
      visit(file === "index.html" ? "app/page.tsx" : `app/${file.replace(/\.html$/, "")}/page.tsx`);
    }
    return [...hrefs].sort();
  }
  const assetPaths = new Set();
  function addLocalAsset(value) {
    if (value.startsWith("https://ersiyan.com/")) value = new URL(value).pathname;
    if (value.startsWith("/") && !value.startsWith("//")) {
      assetPaths.add(value.split(/[?#]/, 1)[0]);
    }
  }

  for (const [pageIndex, html] of pages.entries()) {
    // Check the complete dependency set, not only whichever styles happened
    // to survive static rendering. This guards external and embedded delivery.
    const styles = [...html.matchAll(/<style\b[^>]*data-vinext-inline-css[^>]*data-href="([^"]+)"[^>]*>([\s\S]*?)<\/style>/g)];
    const linkedStyles = [...html.matchAll(/<link\b(?=[^>]*rel="stylesheet")[^>]*href="([^"]+)"[^>]*>/gi)]
      .map(([, href]) => href);
    const allStyleHrefs = [...styles.map(([, href]) => href), ...linkedStyles];
    assert.ok(allStyleHrefs.length > 0, "Static HTML includes its route styles");
    assert.equal(new Set(allStyleHrefs).size, allStyleHrefs.length,
      "Each route stylesheet is included once");
    assert.deepEqual(allStyleHrefs.sort(), requiredStyles(pageFiles[pageIndex]),
      "Static HTML contains every stylesheet required by its build dependencies");
    for (const [, href, css] of styles) {
      assert.equal(css, await readFile(new URL(`.${href}`, client), "utf8"),
        "The embedded CSS preserves the complete compiled stylesheet");
    }
    for (const match of html.matchAll(/<(?:img|script|link)\b[^>]*?\b(?:src|href)=["']([^"']+)["']/gi)) {
      // Absolute canonical links identify pages, not files in the asset directory.
      if (match[1].startsWith("/")) addLocalAsset(match[1]);
    }
    for (const [, candidates] of html.matchAll(/\b(?:srcset|imagesrcset)="([^"]+)"/gi)) {
      for (const candidate of candidates.split(",")) addLocalAsset(candidate.trim().split(/\s+/)[0]);
    }
    for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
      if (/\b(?:name|property)="(?:og:image|twitter:image)"/i.test(tag)) {
        const content = tag.match(/\bcontent="([^"]+)"/i)?.[1];
        if (content) addLocalAsset(content);
      }
    }
  }

  assert.ok(assetPaths.size > 0);
  await Promise.all(
    [...assetPaths].map((pathname) => access(new URL(`.${pathname}`, client))),
  );
});

test("explicit permanent aliases are staged without loops or query overrides", async () => {
  const [source, staged] = await Promise.all([
    readFile(new URL("public/_redirects", root), "utf8"),
    readFile(new URL("_redirects", client), "utf8"),
  ]);
  assert.equal(staged, source);
  const rules = source.split(/\r?\n/).map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#")).map((line) => line.split(/\s+/));
  const expected = new Map([["/index", "/"], ["/index/", "/"], ["/index.html", "/"], ["/games", "/"]]);
  for (const path of ["/games", "/virtual", "/mine-logic", "/velsien-summit", "/velsien-summit/world",
    "/velsien-summit/corporate/orysen", "/velsien-summit/corporate/virenta", "/velsien-summit/corporate/neryx",
    "/velsien-summit/late-update", "/velsien-summit/secret", "/privacy", "/privacy/mine-logic",
    "/privacy/archive/2026-08-22", "/privacy/archive/2026-08-23", "/privacy/archive/2026-08-28", "/privacy/archive/2026-08-31", "/privacy/archive/2026-09-05"]) {
    for (const suffix of ["/", ".html", "/index", "/index/", "/index.html"]) {
      expected.set(`${path}${suffix}`, path === "/games" ? "/" : path);
    }
  }
  assert.equal(rules.length, expected.size);
  for (const [from, to, status, ...extra] of rules) {
    assert.equal(extra.length, 0);
    assert.equal(status, "301");
    assert.equal(to, expected.get(from), from);
    assert.doesNotMatch(from + to, /[?*]|https?:/);
    assert.ok(!expected.has(to), `${from} redirects directly to its canonical page`);
    expected.delete(from);
  }
  assert.equal(expected.size, 0);
});


test("Velsien reserves its hero preload for the desktop viewport", async () => {
  const html = await readFile(new URL("velsien-summit.html", client), "utf8");
  const preloads = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => tag)
    .filter(tag => /rel="preload"/.test(tag) && /devlog-20260905-city-/.test(tag));
  assert.equal(preloads.length, 1, "Exactly one desktop hero preload is emitted");
  for (const preload of preloads) {
    assert.match(preload, /media="\(min-width: 1061px\)"/, "No blanket mobile hero preload is emitted");
  }
  assert.equal(new Set(preloads.map(tag => tag.match(/imagesrcset="([^"]+)"/i)?.[1])).size, 1,
    "Flight and document hints identify the same responsive resource");
  assert.match(preloads[0], /fetchPriority="high"/i);
  assert.match(preloads[0], /imagesrcset="[^"]+640w[^"]+960w[^"]+1600w"/i);
  assert.ok(html.indexOf(preloads[0]) < html.indexOf("</head>"));
  const hero = html.match(/<picture style="display:contents"><img[^>]+devlog-20260905-city-1600\.webp[^>]*>/)?.[0];
  assert.ok(hero, "Picture prevents React automatic image preload");
  assert.match(hero, /loading="eager"/);
  assert.match(hero, /fetchPriority="auto"/i);
  assert.match(hero, /width="1600" height="900"/);
});

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
const gamesHeroPattern =
  /<h1\b[^>]*class="home-page-title"[^>]*>에르시안 게임부 · 게임 개발과 운영<\/h1>/i;

const noticeArticles = [
  ["virtual-recruitment-pause-2026-09-28", "2026-09-28", "버츄얼 모집 일시 중단"],
  ["application-form-2026-09-22", "2026-09-22", "지원서를 좀 더 간단하게 바꿨어요"],
  ["recruitment-privacy-2026-09-19", "2026-09-19", "지원할때 자료?"],
  ["analytics-correction-2026-09-05", "2026-09-05", "방문 통계 설명을 바로잡았어요"],
  ["business-name-2026-08-31", "2026-08-31", "사업자명. 에르시안"],
  ["brand-domain-2026-08-28", "2026-08-28", "에르시안 출범!"],
  ["hosting-change-2026-08-23", "2026-08-23", "홈페이지 이전"],
  ["mine-logic-update-2026-08-28", "2026-08-28", "MINE LOGIC 1.3.3, 이렇게 바뀌었어요"],
];
const noticePaths = ["/notices", ...noticeArticles.map(([slug]) => `/notices/${slug}`)];
const addedPaths = [...noticePaths, "/privacy/archive/2026-09-22"];
const addedHtmlFiles = addedPaths.map((pathname) => `${pathname.slice(1)}.html`);

function visibleText(html) {
  return html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->|<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function structuredEntries(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap(([, json]) => {
      const entry = JSON.parse(json);
      return entry["@graph"] ?? [entry];
    });
}

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
  for (const href of ["/", "/notices", "/privacy", "/privacy/mine-logic", "#top"]) {
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
      "games.html",
      "mine-logic.html",
      "velsien-summit.html",
      "velsien-summit/world.html",
      "velsien-summit/corporate/orysen.html",
      "velsien-summit/corporate/virenta.html",
      "velsien-summit/corporate/neryx.html",
      "velsien-summit/secret.html",
      "privacy.html",
      "privacy/mine-logic.html",
      "privacy/archive/2026-08-22.html",
      "privacy/archive/2026-08-23.html",
      "privacy/archive/2026-08-28.html",
      "privacy/archive/2026-08-31.html",
      "privacy/archive/2026-09-05.html",
      "privacy/archive/2026-09-19.html",
      ...addedHtmlFiles,
      "404.html",
      "_headers",
      "_redirects",
      "robots.txt",
      "sitemap.xml",
      "llms.txt",
      "ersiyan-brand-social.jpg",
      "ersiyan-social-card.jpg",
      "ersiyan-virtual-gen0-social-card.png",
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
  await assert.rejects(
    access(new URL("velsien-summit/late-update.html", client)),
    { code: "ENOENT" },
    "The retired August route must not remain as a deployable static page",
  );

  const [games, virtual, mineLogic, velsienSummit, velsienWorld, velsienSecret, privacyPolicy, mineLogicPrivacyPolicy, archivedPrivacyPolicy, archivedPrivacyPolicy20260823, archivedPrivacyPolicy20260828, archivedPrivacyPolicy20260831, archivedPrivacyPolicy20260905, archivedPrivacyPolicy20260919, notFound, headers, robots, sitemap, llms] = await Promise.all([
    readFile(new URL("games.html", client), "utf8"),
    readFile(new URL("virtual.html", client), "utf8"),
    readFile(new URL("mine-logic.html", client), "utf8"),
    readFile(new URL("velsien-summit.html", client), "utf8"),
    readFile(new URL("velsien-summit/world.html", client), "utf8"),
    readFile(new URL("velsien-summit/secret.html", client), "utf8"),
    readFile(new URL("privacy.html", client), "utf8"),
    readFile(new URL("privacy/mine-logic.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-22.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-23.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-28.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-31.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-09-05.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-09-19.html", client), "utf8"),
    readFile(new URL("404.html", client), "utf8"),
    readFile(new URL("_headers", client), "utf8"),
    readFile(new URL("robots.txt", client), "utf8"),
    readFile(new URL("sitemap.xml", client), "utf8"),
    readFile(new URL("llms.txt", client), "utf8"),
  ]);

  for (const [pathname, html] of [
    ["/games", games],
    ["/virtual", virtual],
    ["/mine-logic", mineLogic],
    ["/privacy", privacyPolicy],
    ["/privacy/mine-logic", mineLogicPrivacyPolicy],
    ["/privacy/archive/2026-08-22", archivedPrivacyPolicy],
    ["/privacy/archive/2026-08-23", archivedPrivacyPolicy20260823],
    ["/privacy/archive/2026-08-28", archivedPrivacyPolicy20260828],
    ["/privacy/archive/2026-08-31", archivedPrivacyPolicy20260831],
    ["/privacy/archive/2026-09-05", archivedPrivacyPolicy20260905],
    ["/privacy/archive/2026-09-19", archivedPrivacyPolicy20260919],
    ["/velsien-summit", velsienSummit],
    ["/velsien-summit/world", velsienWorld],
    ["/velsien-summit/secret", velsienSecret],
  ]) {
    assertCommonFooter(html, pathname);
  }

  assert.match(games, /<html[^>]*lang="ko"/i);
  assert.match(
    games,
    /<title>에르시안 게임부 · 게임 개발과 운영 \| ERSIYAN GAMES<\/title>/i,
  );
  assert.match(
    games,
    /<meta property="og:title" content="에르시안 게임부 · 게임 개발과 운영 \| ERSIYAN GAMES"\/>/i,
  );
  assert.match(
    games,
    /<meta name="twitter:title" content="에르시안 게임부 · 게임 개발과 운영 \| ERSIYAN GAMES"\/>/i,
  );
  assert.match(games, /property="og:image" content="https:\/\/ersiyan\.com\/ersiyan-brand-social\.jpg"/i);
  assert.match(games, /name="twitter:image" content="https:\/\/ersiyan\.com\/ersiyan-brand-social\.jpg"/i);
  for (const [image, width, height] of [
    ["/images/mine-logic/02_hint-540.webp", 540, 960],
    ["/images/velsien-summit/devlog-20260905-city-960.webp", 960, 540],
  ]) {
    const heroImage = [...games.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => tag)
      .find((tag) => tag.includes(`src="${image}"`));
    assert.ok(heroImage, `The games hero retains ${image}`);
    assert.match(heroImage, new RegExp(`width="${width}" height="${height}"`));
    assert.match(heroImage, /loading="eager" decoding="async"/);
  }
  assert.match(games, /"@type":"WebPage"/);
  assert.match(games, /"email":"help@ersiyan\.com"/);
  assert.match(games, gamesHeroPattern);
  assert.match(games, /href="\/mine-logic"/i);
  assert.match(games, /<a\b(?=[^>]*id="ersiyan-virtual-tab")(?=[^>]*href="\/virtual")[^>]*>/i);
  assert.doesNotMatch(games, /<section\b[^>]*id="ersiyan-virtual-view"/i);
  assert.match(virtual, /<a\b(?=[^>]*id="ersiyan-games-tab")(?=[^>]*href="\/games")[^>]*>/i);
  assert.match(virtual, /<a\b(?=[^>]*id="ersiyan-virtual-tab")(?=[^>]*aria-current="page")[^>]*>/i);
  assert.match(virtual, /<section\b[^>]*id="ersiyan-virtual-view"/i);
  assert.doesNotMatch(virtual, /<section\b[^>]*id="ersiyan-games-view"/i);
  assert.match(virtual, /rel="canonical" href="https:\/\/ersiyan\.com\/virtual"/i);
  for (const [pathname, html] of [["/games", games], ["/virtual", virtual]]) {
    const page = structuredEntries(html).find((entry) => entry["@type"] === "WebPage"
      && entry.url === `https://ersiyan.com${pathname}`);
    assert.ok(page, `${pathname} exposes its canonical WebPage`);
    assert.equal(page.dateModified, "2026-09-30",
      `${pathname} records its actual latest content edit`);
    assert.doesNotMatch(html, /id="(?:site-notices|ersiyan-company-view|company-history)"/);
    assert.doesNotMatch(html, /href="#ersiyan-company-view"/);
    assert.match(html, /href="\/"/);
    assert.match(html, /href="\/notices"/);
  }
  assert.match(virtual, /지원 접수 일시 중단/);
  assert.doesNotMatch(virtual, /id="virtual-pause-notice-title"/,
    "The user removed the duplicated recruitment pause box from the hero");
  assert.equal((visibleText(virtual).match(/\(모집 일시중단\)/g) ?? []).length, 2,
    "The hero and lower application actions both show the pause note");
  assert.match(virtual, /모집 인원<\/dt><dd>1명/);
  assert.match(virtual, /만 19세 이상/);
  assert.match(virtual, /CHZZK/);
  assert.match(virtual, /3~5분/);
  assert.doesNotMatch(virtual, /70\s*[/:]\s*30/);
  assert.match(virtual, /<h1\b[^>]*id="virtual-title"/i);
  assert.match(virtual, /ersiyan-virtual-gen0-social-card\.png/i);
  assert.match(virtual, /href="#virtual-apply"/);
  assert.match(virtual, /href="https:\/\/(?:docs\.google\.com\/forms\/d\/e\/[^/"]+\/viewform(?:\?[^"]*)?|forms\.gle\/[^"]+)"/);
  assert.match(virtual, /Google 로그인/);
  const applicationAnchors = [...virtual.matchAll(/<a\b[^>]*href="https:\/\/docs\.google\.com\/forms\/d\/e\/[^/"]+\/viewform(?:\?[^"]*)?"[^>]*>/gi)]
    .map(([anchor]) => anchor);
  assert.equal(applicationAnchors.length, 3, "All three application links remain available during the displayed pause");
  for (const anchor of applicationAnchors) {
    assert.doesNotMatch(anchor, /aria-disabled="true"|\bdisabled(?:=|\s|>)/i,
      "The displayed recruitment pause does not disable the application links");
    assert.match(anchor, /target="_blank"/i);
    assert.match(anchor, /rel="noopener noreferrer"/i);
  }
  assert.match(virtual, /처음 방송을 켜고 시청자 다섯 명과 이야기한다면/);
  assert.doesNotMatch(virtual, /href="mailto:biz@ersiyan\.com\?subject=/);
  assert.match(virtual, /<section\b[^>]*id="virtual-apply"[^>]*>[\s\S]*?href="\/privacy"[\s\S]*?<\/section>/i);
  assert.match(virtual, /id="business-info"/);
  assert.doesNotMatch(virtual, /href="\/velsien-summit\/secret"/i);
  assert.match(games, /feature-480\.webp 480w/i);
  assert.match(games, /06_lobby-360\.webp 360w/i);
  assert.doesNotMatch(
    games,
    /src="\/images\/mine-logic\/(?:02_hint|03_training)\.png"/i,
  );
  assert.match(games, /게임제작업자 등록번호/);
  assert.match(games, /제2026-000002호/);
  assert.match(games, /개인사업자 에르시안이 운영하는 공식 홈페이지입니다/);
  assert.match(games, /aria-label="에르시안 사업자 정보"/);
  assert.doesNotMatch(games, /ERSIYAN은 애플파이가 운영하는 브랜드입니다/);
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
  assert.match(velsienSummit, /id="devlog-2026-08-late"/i);
  assert.doesNotMatch(velsienSummit, /href="\/velsien-summit\/late-update"/i);
  assert.match(velsienWorld, /rel="canonical" href="https:\/\/ersiyan\.com\/velsien-summit\/world"/i);
  assert.match(velsienWorld, /href="\/velsien-summit"/i);
  assert.doesNotMatch(velsienWorld, /name="robots" content="[^"]*\b(?:noindex|nofollow|none)\b/i);
  assert.match(velsienSummit, /2026년 8월 말 개발 화면/);
  assert.match(velsienSummit, /late-update-operation\.webp/i);
  assert.match(velsienSummit, /late-update-gacha\.webp/i);
  assert.match(velsienSummit, /late-update-formation\.webp/i);
  assert.match(velsienSecret, /시각 자료 보관/);
  assert.match(velsienSecret, /images\/velsien-summit\/secret\/nika-oren\.webp/i);
  assert.match(velsienSecret, /images\/velsien-summit\/secret\/battle-percussion-rings\.webp/i);
  assert.doesNotMatch(velsienSecret, /name="robots" content="[^"]*noindex/i);
  assert.doesNotMatch(games, /href="\/velsien-summit\/secret"/i);
  assert.doesNotMatch(velsienSummit, /href="\/velsien-summit\/secret"/i);
  assert.ok(
    (games.match(/<a\b[^>]*href="\/velsien-summit"[^>]*>/gi)?.length ?? 0) >= 1,
    "The games page links to the Velsien product page",
  );
  assert.match(games, /OUR GAMES · 01/);
  assert.match(games, /WORLD FILE \/\/ WORK IN PROGRESS/);
  assert.match(games, /아름답게 돌아가는 미래도시/);
  assert.match(velsienSummit, /href="\/velsien-summit\/world"/);
  assert.doesNotMatch(velsienSummit, /세 기업의 실제 이름과 상징/);
  assert.match(games, /어느 기업에도 묶이지 않은 계약자/);
  assert.match(games, /세 개의 기업 채널/);
  assert.equal(
    games.match(/id="game-tab-(?:mine-logic|velsien)"/g)?.length ?? 0,
    2,
  );
  assert.equal(
    games.match(/id="velsien-scene-(?:title|lobby|character)"/g)?.length ?? 0,
    3,
  );
  for (const image of [
    "teaser-title.webp",
    "teaser-lobby.webp",
    "teaser-character.webp",
  ]) {
    assert.match(games, new RegExp(`images/velsien-summit/${image.replace(".", "\\.")}`, "i"));
    assert.match(
      velsienSummit,
      new RegExp(`images/velsien-summit/${image.replace(".", "\\.")}`, "i"),
    );
  }
  assert.match(privacyPolicy, /<title>개인정보처리방침 \| 에르시안<\/title>/i);
  assert.match(privacyPolicy, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy"/i);
  assert.match(privacyPolicy, /href="\/notices\/business-name-2026-08-31"/);
  assert.match(privacyPolicy, /개인사업자 에르시안\(대표자 탁진/);
  assert.match(privacyPolicy, /\/privacy\/archive\/2026-08-28/);
  assert.match(privacyPolicy, /href="\/privacy\/archive\/2026-08-31"/);
  assert.match(privacyPolicy, /href="\/privacy\/archive\/2026-09-05"/);
  assert.match(privacyPolicy, /href="\/privacy\/archive\/2026-09-19"/);
  assert.match(privacyPolicy, /href="\/privacy\/archive\/2026-09-22"/);
  assert.match(privacyPolicy, /최근 변경일 및 시행일 2026년 9월 22일/);
  assert.match(privacyPolicy, /최종 선정일로부터[\s\S]*?30일 이내에 삭제합니다/);
  assert.match(privacyPolicy, /선정 없이 모집을 취소하거나 종료하면[\s\S]*?30일 이내에 삭제합니다/);
  assert.match(privacyPolicy, /AI 학습이나 홍보 콘텐츠에[\s\S]*?재사용하지 않습니다/);
  assert.match(privacyPolicy, /Cloudflare Web Analytics/);
  for (const [pathname, html] of [
    ["/privacy", privacyPolicy],
    ["/privacy/mine-logic", mineLogicPrivacyPolicy],
    ["/privacy/archive/2026-09-05", archivedPrivacyPolicy20260905],
    ["/privacy/archive/2026-09-19", archivedPrivacyPolicy20260919],
  ]) {
    const structuredData = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .map(([, json]) => JSON.parse(json));
    const page = structuredData.find((entry) => entry.url === `https://ersiyan.com${pathname}`);
    assert.ok(page, `${pathname} has structured data for its canonical page`);
    assert.equal(page["@type"], "WebPage", `${pathname} uses the supported Schema.org WebPage type`);
  }
  assert.match(mineLogicPrivacyPolicy, /<title>MINE LOGIC Privacy Policy \| 에르시안<\/title>/i);
  assert.match(mineLogicPrivacyPolicy, /https:\/\/ersiyan\.com\/privacy\/mine-logic/i);
  assert.match(mineLogicPrivacyPolicy, /MINE LOGIC Privacy Policy/);
  assert.doesNotMatch(mineLogicPrivacyPolicy, /document\.documentElement\.lang="en-US"/);
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
  assert.match(mineLogicPrivacyPolicy, /href="\/notices\/business-name-2026-08-31"/);
  assert.match(mineLogicPrivacyPolicy, /개인사업자 에르시안/);
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
  assert.match(archivedPrivacyPolicy20260919, /<title>개인정보처리방침 2026년 9월 19일 보관본 \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy20260919, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy\/archive\/2026-09-19"/i);
  assert.match(archivedPrivacyPolicy20260919, /id="recruitment-notice"/);
  for (const archive of [archivedPrivacyPolicy, archivedPrivacyPolicy20260823, archivedPrivacyPolicy20260828, archivedPrivacyPolicy20260831, archivedPrivacyPolicy20260905, archivedPrivacyPolicy20260919]) {
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
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/virtual<\/loc>\s*<lastmod>2026-09-30<\/lastmod>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit\/world<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit\/world<\/loc>\s*<lastmod>2026-09-20<\/lastmod>/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit\/late-update<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit\/secret<\/loc>/);
  assert.deepEqual(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort(),
    [
      "https://ersiyan.com/",
      "https://ersiyan.com/virtual",
      "https://ersiyan.com/games",
      "https://ersiyan.com/mine-logic",
      "https://ersiyan.com/velsien-summit",
      "https://ersiyan.com/velsien-summit/corporate/orysen",
      "https://ersiyan.com/velsien-summit/corporate/virenta",
      "https://ersiyan.com/velsien-summit/corporate/neryx",
      "https://ersiyan.com/velsien-summit/world",
      "https://ersiyan.com/velsien-summit/secret",
      "https://ersiyan.com/privacy",
      "https://ersiyan.com/privacy/mine-logic",
      "https://ersiyan.com/privacy/archive/2026-08-22",
      "https://ersiyan.com/privacy/archive/2026-08-23",
      "https://ersiyan.com/privacy/archive/2026-08-28",
      "https://ersiyan.com/privacy/archive/2026-08-31",
      "https://ersiyan.com/privacy/archive/2026-09-05",
      "https://ersiyan.com/privacy/archive/2026-09-19",
      ...addedPaths.map((pathname) => `https://ersiyan.com${pathname}`),
    ].sort(),
  );
  assert.equal(sitemap, await readFile(new URL("public/sitemap.xml", root), "utf8"),
    "Staged sitemap preserves the current source URLs and modification dates");
  const currentEditedRoutes = new Set([
    "https://ersiyan.com/",
    "https://ersiyan.com/virtual",
    "https://ersiyan.com/games",
    ...noticePaths.map((pathname) => `https://ersiyan.com${pathname}`),
  ]);
  const company = await readFile(new URL("index.html", client), "utf8");
  assertCommonFooter(company, "/");
  assert.match(company, /rel="canonical" href="https:\/\/ersiyan\.com\/?"/i);
  assert.match(company, /에르시안 연혁/);
  assert.match(company, /href="\/notices"/);
  assert.match(company, /href="\/games"/);
  assert.match(company, /href="\/virtual"/);
  assert.match(company, /id="company-title"/);
  assert.match(company, /"@type":"AboutPage"/);
  assert.doesNotMatch(company, /id="(?:ersiyan-games-view|ersiyan-virtual-view|virtual-apply)"/);
  assert.match(games, /rel="canonical" href="https:\/\/ersiyan\.com\/games"/i);
  await assert.rejects(access(new URL("company.html", client)),
    "The former company page is a permanent alias, not a duplicate static document");
  assert.equal(currentEditedRoutes.size, 12, "The company page and both divisions are current alongside notices");
  const reorganizedRoutes = new Set([
    "https://ersiyan.com/",
    "https://ersiyan.com/virtual",
    "https://ersiyan.com/mine-logic",
    "https://ersiyan.com/privacy",
    "https://ersiyan.com/privacy/mine-logic",
    ...addedPaths.map((pathname) => `https://ersiyan.com${pathname}`),
  ]);
  const september22Routes = new Set([
    "https://ersiyan.com/privacy/archive/2026-09-05",
    "https://ersiyan.com/privacy/archive/2026-09-19",
  ]);
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
    assert.equal(date, location === "https://ersiyan.com/notices" ? "2026-10-02" :
      ["https://ersiyan.com/", "https://ersiyan.com/virtual", "https://ersiyan.com/games"].includes(location) ? "2026-09-30" :
      currentEditedRoutes.has(location) ? "2026-09-29" :
      reorganizedRoutes.has(location) ? "2026-09-28" :
      september22Routes.has(location) ? "2026-09-22" : "2026-09-20",
      `${location} changes lastmod only when its content or structured data changes`);
  }
  assert.match(llms, /https:\/\/ersiyan\.com\/mine-logic/);
  assert.match(llms, /biz@ersiyan\.com/);
  assert.match(llms, /https:\/\/ersiyan\.com\/velsien-summit\/world/);
  assert.match(llms, /com\.applepie\.minelogic/);
  assert.match(llms, /https:\/\/ersiyan\.com\/notices/);
  assert.match(llms, /https:\/\/ersiyan\.com\/notices\/virtual-recruitment-pause-2026-09-28/);

  for (const html of [company, games, virtual, mineLogic, velsienSummit, velsienWorld, velsienSecret, privacyPolicy, mineLogicPrivacyPolicy, archivedPrivacyPolicy, archivedPrivacyPolicy20260823, archivedPrivacyPolicy20260828, archivedPrivacyPolicy20260831, archivedPrivacyPolicy20260905, archivedPrivacyPolicy20260919, notFound]) {
    assert.doesNotMatch(html, /dist\/server|server\/index\.js|\/_worker\.js/i);
    for (const forbiddenPattern of forbiddenErsiyanGameStudioPatterns) {
      assert.doesNotMatch(html, forbiddenPattern);
    }
  }

  assert.doesNotMatch(
    velsienSummit,
    /Project8|QA\/Evidence|Client\/Assets|Lesia|Nael|ABOUT THE TITLE|추가 데이터는 아직 공개되지 않았습니다/,
  );
});

test("notice documents retain original dates, article links, and the complete prior policy", async () => {
  const pages = new Map(await Promise.all(addedPaths.map(async (pathname) => {
    const filename = `${pathname.slice(1)}.html`;
    const html = await readFile(new URL(filename, client), "utf8");
    assert.equal(html, await readFile(new URL(`dist/server/prerendered-routes/${filename}`, root), "utf8"),
      `${pathname} is the complete prerendered document`);
    assertCommonFooter(html, pathname);
    const canonicalTags = [...html.matchAll(/<link\b(?=[^>]*rel="canonical")[^>]*>/gi)];
    assert.equal(canonicalTags.length, 1, `${pathname} has one canonical URL`);
    assert.match(canonicalTags[0][0], new RegExp(`href="https://ersiyan\\.com${pathname}"`));
    assert.match(html, new RegExp(`property="og:url" content="https://ersiyan\\.com${pathname}"`));
    assert.doesNotMatch(html, /name="robots" content="[^"]*(?:noindex|nofollow|none)/i);
    assert.doesNotMatch(html, /dist\/server|server\/index\.js|\/_worker\.js/i);
    return [pathname, html];
  })));

  const index = pages.get("/notices");
  assert.match(index, /<h1\b[^>]*>공지사항<\/h1>/);
  assert.match(index, /href="#notice-content"/);
  assert.match(index, /<main\b[^>]*id="notice-content"/);
  const indexMain = index.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  assert.ok(indexMain);
  const noticeRows = [...indexMain.matchAll(/<a\b[^>]*href="\/notices\/[^"?#]+"[^>]*>/gi)].map(([tag]) => tag);
  assert.equal(noticeRows.length, 8, "All notices use one common list");
  const rowClasses = noticeRows.map((tag) => tag.match(/\bclass="([^"]+)"/)?.[1]);
  assert.ok(rowClasses.every(Boolean), "Every notice is rendered as a list row");
  assert.equal(new Set(rowClasses).size, 1, "The newest notice is not a featured card");
  assert.doesNotMatch(visibleText(indexMain), /쉬어|함께\s*살펴/);
  const listedPaths = [...new Set([...index.matchAll(/<a\b[^>]*href="(\/notices\/[^"?#]+)"/gi)]
    .map(([, href]) => href))].sort();
  assert.deepEqual(listedPaths, noticePaths.filter((path) => path !== "/notices").sort(),
    "Every published article is discoverable from the notice index");
  const collection = structuredEntries(index).find((entry) => entry["@type"] === "CollectionPage");
  assert.ok(collection, "The notice index describes its article collection");
  assert.equal(collection.url, "https://ersiyan.com/notices");
  assert.equal(collection.datePublished, "2026-09-28");
  assert.equal(collection.dateModified, "2026-10-02");
  assert.equal(collection.publisher["@id"], "https://ersiyan.com/#organization");
  assert.equal(collection.publisher["@type"], "Organization");
  assert.equal(collection.publisher.name, "에르시안");
  assert.equal(collection.publisher.url, "https://ersiyan.com/");
  assert.equal(collection.mainEntity["@type"], "ItemList");
  assert.deepEqual(collection.mainEntity.itemListElement.map((item) => item.url).sort(),
    noticeArticles.map(([slug]) => `https://ersiyan.com/notices/${slug}`).sort());
  const listedDates = [...index.matchAll(/<time\b[^>]*dateTime="([^"]+)"/gi)].map(([, date]) => date);
  assert.equal(listedDates.length, 8, "The index displays one original date per article");
  assert.deepEqual(listedDates, [...listedDates].sort().reverse(), "Announcements are ordered by their original dates");

  for (const [slug, published, title] of noticeArticles) {
    const pathname = `/notices/${slug}`;
    const html = pages.get(pathname);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
    assert.ok(main, `${pathname} has visible main content`);
    assert.doesNotMatch(visibleText(main), /쉬어|함께\s*살펴/);
    assert.match(html, /<article\b[^>]*aria-labelledby="notice-title"/);
    assert.match(html, /<h1\b[^>]*id="notice-title"[^>]*>[^<]+<\/h1>/);
    assert.equal(html.match(/<h1\b[^>]*id="notice-title"[^>]*>([^<]+)<\/h1>/)?.[1], title,
      `${pathname} renders its current title`);
    assert.match(html, /href="\/notices"/);
    assert.match(html, new RegExp(`<time\\b[^>]*dateTime="${published}"`, "i"));
    const article = structuredEntries(html).find((entry) => entry["@type"] === "Article");
    assert.ok(article, `${pathname} has Article structured data`);
    assert.equal(article.headline, title);
    assert.equal(article.url, `https://ersiyan.com${pathname}`);
    assert.equal(article.mainEntityOfPage, article.url);
    assert.equal(article.datePublished, published, `${pathname} retains its original publication date`);
    assert.equal(article.dateModified, "2026-09-29", `${pathname} records its latest modification date separately`);
    for (const role of ["author", "publisher"]) {
      assert.equal(article[role]["@id"], "https://ersiyan.com/#organization");
      assert.equal(article[role]["@type"], "Organization");
      assert.equal(article[role].name, "에르시안");
      assert.equal(article[role].url, "https://ersiyan.com/");
    }
    assert.match(html, new RegExp(`property="article:published_time" content="${published}"`));
    assert.match(html, /property="article:modified_time" content="2026-09-29"/);
    assert.doesNotMatch(main, /aria-label="지난 안내"/,
      `${pathname} omits the historical guidance box`);
    assert.doesNotMatch(visibleText(main), /게시 당시 기준|게시일 기준의 안내예요|현재 내용은 관련 링크의 최신 공지와 페이지에서 확인할 수 있어요/,
      `${pathname} omits the removed historical guidance text`);
    if (published !== "2026-09-28") {
      const related = main.match(/<section\b[^>]*aria-labelledby="notice-related-title"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
      assert.ok(related, `${pathname} has related pages`);
      assert.equal(visibleText(related.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? ""), "관련 링크");
      assert.ok(related.match(/<a\b[^>]*href="[^"]+"/i), `${pathname} has no empty related section`);
    }
  }

  const articleHtml = (slug) => {
    const markup = pages.get(`/notices/${slug}`).match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
    assert.ok(markup, `${slug} has visible article content`);
    return markup;
  };
  const articleBody = (slug) => {
    const markup = articleHtml(slug).match(/<div\b[^>]*class="[^"]*articleBody[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1];
    assert.ok(markup, `${slug} has visible article paragraphs`);
    return markup;
  };
  const articleText = (slug) => visibleText(articleBody(slug));
  const pauseSlug = "virtual-recruitment-pause-2026-09-28";
  assert.match(articleText(pauseSlug), /내부 준비.*크리에이터 모집.*일시 중단/);
  assert.match(articleText(pauseSlug), /모집(?: 재개|을 다시 시작).*공지/);
  assert.equal(articleBody(pauseSlug).match(/<p\b/gi)?.length, 2, "The pause announcement has two brief paragraphs");
  const pauseHeader = articleHtml(pauseSlug).match(/<header\b[^>]*>([\s\S]*?)<\/header>/i)?.[1];
  assert.ok(pauseHeader);
  assert.doesNotMatch(pauseHeader, /<p\b/i, "The title does not repeat the recruitment status");
  assert.doesNotMatch(articleHtml(pauseSlug), /<a\b[^>]*href="\/virtual"/i,
    "The pause article omits the recruitment related link");
  assert.doesNotMatch(articleHtml(pauseSlug), /id="notice-related-title"|aria-labelledby="notice-related-title"/,
    "The pause article omits an empty related section");
  assert.match(articleText("application-form-2026-09-22"), /Google 설문지와 Drive/);
  assert.match(articleText("application-form-2026-09-22"), /이메일.*지원 자료.*심사 목적/);
  assert.match(articleText("application-form-2026-09-22"), /삭제 기준.*(?:유지|그대로)/);
  assert.match(articleText("recruitment-privacy-2026-09-19"), /이메일.*지원서.*음성 파일/);
  assert.match(articleText("recruitment-privacy-2026-09-19"), /선발 기록.*사용 목적.*보관 기간/);
  assert.match(articleText("recruitment-privacy-2026-09-19"), /지원 철회 방법/);
  assert.match(articleText("recruitment-privacy-2026-09-19"), /일반 문의.*홈페이지 방문 정보.*(?:유지|그대로)/);
  assert.match(articleText("recruitment-privacy-2026-09-19"), /2026년 9월 22일.*Google 설문지/);
  assert.match(articleText("analytics-correction-2026-09-05"), /이미.*Cloudflare Web Analytics.*방문·성능 통계.*(?:정정|바로잡)/);
  assert.match(articleText("analytics-correction-2026-09-05"), /새로운 분석 도구.*추가.*아니/);
  assert.match(articleText("business-name-2026-08-31"), /개인사업자명.*애플파이에서 에르시안.*(?:바꿨|변경)/);
  assert.match(articleText("business-name-2026-08-31"), /대표자.*사업자등록번호.*(?:동일|유지|그대로)/);
  assert.match(articleText("business-name-2026-08-31"), /개인정보 처리 목적·범위.*문의처.*호스팅 제공자.*(?:동일|유지|그대로)/);
  assert.match(articleText("brand-domain-2026-08-28"), /브랜드명.*에르시안\(ERSIYAN\).*(?:바꿨|변경)/);
  assert.match(articleText("brand-domain-2026-08-28"), /applepie\.im에서 ersiyan\.com.*(?:옮겼|이전)/);
  assert.match(articleText("brand-domain-2026-08-28"), /당시 사업자명.*애플파이/);
  assert.match(articleText("brand-domain-2026-08-28"), /사업자명 변경.*2026년 8월 31일/);
  assert.match(articleText("brand-domain-2026-08-28"), /개인정보 처리 사업자.*처리 목적·범위.*문의처.*호스팅 제공자.*(?:동일|유지|그대로)/);
  assert.match(articleText("hosting-change-2026-08-23"), /2026년 8월 23일/);
  assert.match(articleText("hosting-change-2026-08-23"), /OpenAI Sites에서 Cloudflare Workers Static Assets/);
  assert.match(articleText("hosting-change-2026-08-23"), /공식 도메인.*Cloudflare.*연결.*시점부터 적용/);
  assert.match(articleText("hosting-change-2026-08-23"), /화면·기능.*직접 수집.*정보의 범위.*(?:유지|그대로)/);
  assert.match(articleText("hosting-change-2026-08-23"), /이메일 문의 자료.*사용 목적.*보관 기간.*(?:동일|유지|그대로)/);
  assert.match(articleText("mine-logic-update-2026-08-28"), /2026년 8월 28일.*MINE LOGIC v1\.3\.3.*Google Play 스토어.*업데이트/);
  assert.match(articleText("mine-logic-update-2026-08-28"), /ERSIYAN\).*로고.*제작자명.*반영/);
  assert.match(articleText("mine-logic-update-2026-08-28"), /개인정보처리방침 링크.*(?:바꿨|변경)/);
  assert.match(articleText("mine-logic-update-2026-08-28"), /다크 모드.*글자.*(?:가독성.*개선|잘 보이)/);
  assert.match(articleHtml("mine-logic-update-2026-08-28"), /href="\/mine-logic"/);

  const archive = pages.get("/privacy/archive/2026-09-22");
  assert.match(archive, /2026년 9월 22일 보관본/);
  assert.match(archive, /Google 설문지·Drive/);
  assert.match(archive, /이전에 이메일로 접수한 지원 자료에도 기존의 심사 목적과 삭제 기준을 유지합니다/);
  const currentPolicy = await readFile(new URL("privacy.html", client), "utf8");
  for (const [id, slug] of [
    ["forms-notice", "application-form-2026-09-22"],
    ["recruitment-notice", "recruitment-privacy-2026-09-19"],
    ["change-notice", "analytics-correction-2026-09-05"],
    ["business-name-notice", "business-name-2026-08-31"],
  ]) {
    assert.match(archive, new RegExp(`<section\\b[^>]*id="${id}"`), `${id} is retained in the complete historical policy`);
    assert.match(currentPolicy, new RegExp(`<li\\b[^>]*id="${id}"[^>]*>[\\s\\S]*?href="/notices/${slug}"[\\s\\S]*?</li>`),
      `${id} preserves incoming fragments and links to the migrated article`);
    assert.doesNotMatch(currentPolicy, new RegExp(`<section\\b[^>]*id="${id}"`), "Announcements are separated from current processing terms");
  }
  for (const id of ["overview", "collection", "hosting", "application-service", "purpose", "cookies", "rights", "apps", "changes"]) {
    assert.match(archive, new RegExp(`<section\\b[^>]*id="${id}"`), `${id} remains in the complete policy snapshot`);
    assert.match(currentPolicy, new RegExp(`<section\\b[^>]*id="${id}"`), `${id} remains in the current legal policy`);
  }
  assert.match(currentPolicy, /이전에 이메일로 접수한 지원 자료/);
  const product = await readFile(new URL("mine-logic.html", client), "utf8");
  assert.match(product, /href="\/notices\/mine-logic-update-2026-08-28"/);
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
  const pageFiles = ["index.html", "games.html", "virtual.html", "mine-logic.html", "velsien-summit.html", "velsien-summit/world.html", "velsien-summit/secret.html", "privacy.html", "privacy/mine-logic.html", "privacy/archive/2026-08-22.html", "privacy/archive/2026-08-23.html", "privacy/archive/2026-08-28.html", "privacy/archive/2026-08-31.html", "privacy/archive/2026-09-05.html", "privacy/archive/2026-09-19.html", ...addedHtmlFiles, "404.html"];
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
  const expected = new Map([["/index", "/"], ["/index/", "/"], ["/index.html", "/"], ["/company", "/"]]);
  for (const path of ["/games", "/virtual", "/mine-logic", "/velsien-summit", "/velsien-summit/world",
    "/velsien-summit/corporate/orysen", "/velsien-summit/corporate/virenta", "/velsien-summit/corporate/neryx",
    "/velsien-summit/secret", "/company", "/privacy", "/privacy/mine-logic",
    "/privacy/archive/2026-08-22", "/privacy/archive/2026-08-23", "/privacy/archive/2026-08-28", "/privacy/archive/2026-08-31", "/privacy/archive/2026-09-05", "/privacy/archive/2026-09-19", ...addedPaths]) {
    for (const suffix of ["/", ".html", "/index", "/index/", "/index.html"]) {
      expected.set(`${path}${suffix}`, path === "/company" ? "/" : path);
    }
  }
  expected.set("/velsien-summit/late-update", "/velsien-summit");
  for (const suffix of ["/", ".html", "/index", "/index/", "/index.html"]) {
    expected.set(`/velsien-summit/late-update${suffix}`, "/velsien-summit");
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


test("Velsien preloads its actual battle hero for desktop and mobile", async () => {
  const html = await readFile(new URL("velsien-summit.html", client), "utf8");
  const preloads = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => tag)
    .filter(tag => /rel="preload"/.test(tag) && /devlog-20260905-battle-01-/.test(tag));
  assert.equal(preloads.length, 1, "Exactly one battle hero preload is emitted");
  assert.match(preloads[0], /fetchPriority="high"/i);
  assert.match(preloads[0], /imagesrcset="[^"]+640w[^"]+960w[^"]+1920w"/i);
  assert.ok(html.indexOf(preloads[0]) < html.indexOf("</head>"));
  const hero = html.match(/<img\b[^>]+devlog-20260905-battle-01-960\.webp[^>]*>/)?.[0];
  assert.ok(hero, "The visible hero uses the real battle capture");
  assert.match(hero, /loading="eager"/);
  assert.match(hero, /fetchPriority="high"/i);
  assert.match(hero, /width="1920" height="1080"/);
});

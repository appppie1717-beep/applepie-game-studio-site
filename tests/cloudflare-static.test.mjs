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
  /<h1\b(?=[^>]*\bid=["']hero-title["'])[^>]*>(?:\s|<!--[\s\S]*?-->)*제가 좋아하는 게임을(?:\s|<!--[\s\S]*?-->)*<br\s*\/?>(?:\s|<!--[\s\S]*?-->)*<span\b[^>]*>(?:\s|<!--[\s\S]*?-->)*직접 만들고(?:\s|<!--[\s\S]*?-->)*<\/span>(?:\s|<!--[\s\S]*?-->)*<br\s*\/?>(?:\s|<!--[\s\S]*?-->)*끝까지 운영합니다\.(?:\s|<!--[\s\S]*?-->)*<\/h1>/i;

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
    ["index.html", "velsien-summit.html", "privacy.html", "privacy/mine-logic.html", "privacy/archive/2026-08-22.html", "privacy/archive/2026-08-23.html", "404.html", "_headers", "robots.txt", "sitemap.xml", "ersiyan-social-card.jpg", "ersiyan-mark.svg", "images/brand/ersiyan-logo.png", "images/brand/ersiyan-logo-hero.webp", "images/velsien-summit/teaser-title-640.webp", "images/velsien-summit/teaser-title-960.webp", "images/velsien-summit/teaser-title.webp", "images/velsien-summit/teaser-lobby-640.webp", "images/velsien-summit/teaser-lobby-960.webp", "images/velsien-summit/teaser-lobby.webp", "images/velsien-summit/teaser-character-640.webp", "images/velsien-summit/teaser-character-960.webp", "images/velsien-summit/teaser-character.webp", "images/velsien-summit/velsien-summit-social.jpg"].map((file) =>
      access(new URL(file, client)),
    ),
  );

  const [homepage, velsienSummit, privacyPolicy, mineLogicPrivacyPolicy, archivedPrivacyPolicy, archivedPrivacyPolicy20260823, notFound, robots, sitemap] = await Promise.all([
    readFile(new URL("index.html", client), "utf8"),
    readFile(new URL("velsien-summit.html", client), "utf8"),
    readFile(new URL("privacy.html", client), "utf8"),
    readFile(new URL("privacy/mine-logic.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-22.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-23.html", client), "utf8"),
    readFile(new URL("404.html", client), "utf8"),
    readFile(new URL("robots.txt", client), "utf8"),
    readFile(new URL("sitemap.xml", client), "utf8"),
  ]);

  assert.match(homepage, /<html[^>]*lang="ko"/i);
  assert.match(homepage, /<title>에르시안<\/title>/i);
  assert.match(homepage, /ersiyan-social-card\.jpg/i);
  assert.match(homepage, /ersiyan-logo-hero\.webp/i);
  assert.match(homepage, homepageHeroPattern);
  assert.match(homepage, /게임제작업자 등록번호/);
  assert.match(homepage, /제2026-000002호/);
  assert.match(
    velsienSummit,
    /<title>VELSIEN SUMMIT\(벨시엔 서밋\) \| 모바일 수집형 2D SRPG<\/title>/i,
  );
  assert.match(velsienSummit, /rel="canonical" href="https:\/\/ersiyan\.com\/velsien-summit"/i);
  assert.match(velsienSummit, /property="og:url" content="https:\/\/ersiyan\.com\/velsien-summit"/i);
  assert.match(velsienSummit, /images\/velsien-summit\/velsien-summit-social\.jpg/i);
  assert.match(velsienSummit, /teaser-title-640\.webp 640w/i);
  assert.match(velsienSummit, /teaser-title-960\.webp 960w/i);
  assert.match(velsienSummit, /teaser-lobby-640\.webp 640w/i);
  assert.match(velsienSummit, /teaser-character-640\.webp 640w/i);
  assert.doesNotMatch(velsienSummit, /VelsienSignalDeck\.[^"']+\.css/i);
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
  assert.doesNotMatch(mineLogicPrivacyPolicy, /완료 일시|completion date and time/);
  assert.match(
    mineLogicPrivacyPolicy,
    /represented by(?:<!-- -->)? (?:<!-- -->)?탁진(?:<!-- -->)?\./,
  );
  assert.doesNotMatch(mineLogicPrivacyPolicy, /represented by(?:<!-- -->)?탁진/);
  assert.doesNotMatch(mineLogicPrivacyPolicy, /애플파이 \(애플파이\)/);
  assert.match(archivedPrivacyPolicy, /<title>개인정보처리방침 2026년 8월 22일 보관본 \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy20260823, /<title>개인정보처리방침 2026년 8월 23일 보관본 \| 에르시안<\/title>/i);
  assert.match(notFound, /<title>에르시안<\/title>/i);
  assert.match(robots, /Sitemap:\s*https:\/\/ersiyan\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/ersiyan\.com\/velsien-summit<\/loc>/);

  for (const html of [homepage, velsienSummit, privacyPolicy, mineLogicPrivacyPolicy, archivedPrivacyPolicy, archivedPrivacyPolicy20260823, notFound]) {
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
    ["index.html", "velsien-summit.html", "privacy.html", "privacy/mine-logic.html", "privacy/archive/2026-08-22.html", "privacy/archive/2026-08-23.html", "404.html"].map((file) =>
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

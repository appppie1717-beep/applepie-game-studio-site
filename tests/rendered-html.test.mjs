import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
  /<h1\b[^>]*class="home-page-title"[^>]*>에르시안\(ERSIYAN\) · 게임 개발과 운영<\/h1>/i;

function decodeHtml(value) {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
    const named = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
    if (entity.toLowerCase() in named) return named[entity.toLowerCase()];
    return String.fromCodePoint(entity[2].toLowerCase() === "x"
      ? parseInt(entity.slice(3, -1), 16) : Number(entity.slice(2, -1)));
  });
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)]
    .map(([, name, value]) => [name.toLowerCase(), decodeHtml(value)]));
}

function metaContent(html, name) {
  const matching = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag))
    .filter((tag) => (tag.name ?? tag.property) === name);
  assert.equal(matching.length, 1, `One ${name} meta tag`);
  return matching[0].content;
}

function visibleText(html) {
  return decodeHtml(html.replace(/<head\b[\s\S]*?<\/head>/gi, "")
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ").trim();
}

function policySection(html, id) {
  const section = html.match(new RegExp(`<section\\b(?=[^>]*id="${id}")[^>]*>([\\s\\S]*?)<\\/section>`, "i"))?.[1];
  assert.ok(section, `Policy section ${id} exists`);
  return section;
}

// Visible text captured from the last deployed August 31 policy, before the September 5 correction.
// Hashes exclude markup and normalize spacing, while keeping every historical clause intact.
const august31PolicySectionHashes = {
  "change-notice": "a8ae70cf00e0efa69c6ffc499b77c3ff42e0af3c88486073c4818db25e9871ae",
  overview: "e919ff996c5b4c6572aa26324981faf10ee6165042045d5726aee52c1bbddffd",
  collection: "6fbf397a860809021aebc8e212fa75dcc235f14182e4de3765744b908bc9c570",
  hosting: "57669da5e00330576bec1bf9cabcce502f0671eb1b6e21ea173cc489ed48806d",
  purpose: "c8f652a3ef0afba03215fb93222d0a03ebf5b540601053a64d3c8474145eaf3b",
  cookies: "cfbfcf1430f36a1853142549e3015b066da18e141e45355d2cd1f8fec366e33d",
  rights: "27354e23a538892d59836381f00642462fb9d637e169b47d30774dcd7040e88c",
  apps: "50debeaaf6eee350abc1137d76c580e55d90957a9a015b6fcac3a8a448c55ff9",
  changes: "86b8a3a9192d410110605e6fa1cce9a898d9607562f324308cbdfe17d22fb95e",
};

function structuredNodes(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap(([, source]) => {
      const value = JSON.parse(source);
      return Array.isArray(value) ? value : value["@graph"] ?? [value];
    });
}

function assertPageMetadata(html, pathname, { socialTitle } = {}) {
  const url = `https://ersiyan.com${pathname}`;
  const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  assert.ok(title.length > 0);
  const expectedSocialTitle = socialTitle ?? title;
  assert.equal(metaContent(html, "og:title"), expectedSocialTitle);
  assert.equal(metaContent(html, "twitter:title"), expectedSocialTitle);
  const description = metaContent(html, "description");
  assert.ok(description.length > 0);
  assert.equal(metaContent(html, "og:description"), description);
  assert.equal(metaContent(html, "twitter:description"), description);
  assert.equal(metaContent(html, "og:url"), url);
  const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag))
    .filter(({ rel }) => rel === "canonical");
  assert.deepEqual(canonicals.map(({ href }) => href), [url]);
  assert.equal(metaContent(html, "og:image"), metaContent(html, "twitter:image"));
  assert.ok(metaContent(html, "og:image:alt"));
  assert.ok(metaContent(html, "twitter:image:alt"));
  return { title, description, url, socialTitle: expectedSocialTitle };
}

function assertDivisionLinks(html, current) {
  for (const [division, href] of [["games", "/"], ["virtual", "/virtual"]]) {
    const links = [...html.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attributes(tag))
      .filter(({ id }) => id === `ersiyan-${division}-tab`);
    assert.equal(links.length, 1);
    assert.equal(links[0].href, href);
    assert.equal(links[0]["aria-current"], division === current ? "page" : undefined);
    assert.equal(links[0].role, undefined, "Business divisions navigate between documents");
  }
  assert.doesNotMatch(html, /<button\b[^>]*id="ersiyan-(?:games|virtual)-tab"/i);
}

const footerRoutes = [
  "/",
  "/virtual",
  "/mine-logic",
  "/privacy",
  "/privacy/mine-logic",
  "/privacy/archive/2026-08-22",
  "/privacy/archive/2026-08-23",
  "/privacy/archive/2026-08-28",
  "/privacy/archive/2026-08-31",
  "/privacy/archive/2026-09-05",
  "/velsien-summit",
  "/velsien-summit/world",
  "/velsien-summit/secret",
];

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

test("server-renders the common footer on every footer route", async () => {
  for (const pathname of footerRoutes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, `${pathname} responds successfully`);
    assertCommonFooter(await response.text(), pathname);
  }
});

test("stages every public page for asset-first delivery", async () => {
  const [
    manifestSource,
    pathsSource,
    homepage,
    virtual,
    mineLogic,
    velsienSummit,
    velsienWorld,
    velsienSecret,
    privacyPolicy,
    mineLogicPrivacyPolicy,
    archivedPrivacyPolicy,
    archivedPrivacyPolicy20260823,
    archivedPrivacyPolicy20260828,
    archivedPrivacyPolicy20260831,
    archivedPrivacyPolicy20260905,
    staticHomepage,
    staticVirtual,
    staticMineLogic,
    staticVelsienSummit,
    staticVelsienWorld,
    staticVelsienSecret,
    staticPrivacyPolicy,
    staticMineLogicPrivacyPolicy,
    staticArchivedPrivacyPolicy,
    staticArchivedPrivacyPolicy20260823,
    staticArchivedPrivacyPolicy20260828,
    staticArchivedPrivacyPolicy20260831,
    staticArchivedPrivacyPolicy20260905,
    staticNotFound,
  ] = await Promise.all([
    readFile(new URL("../dist/server/vinext-prerender.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/vinext-prerender-paths.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/index.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/virtual.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/mine-logic.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/velsien-summit.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/velsien-summit/world.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/velsien-summit/secret.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy/mine-logic.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy/archive/2026-08-22.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy/archive/2026-08-23.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy/archive/2026-08-28.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy/archive/2026-08-31.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy/archive/2026-09-05.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/index.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/virtual.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/mine-logic.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/velsien-summit.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/velsien-summit/world.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/velsien-summit/secret.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy/mine-logic.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy/archive/2026-08-22.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy/archive/2026-08-23.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy/archive/2026-08-28.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy/archive/2026-08-31.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy/archive/2026-09-05.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/404.html", import.meta.url), "utf8"),
  ]);

  const manifest = JSON.parse(manifestSource);
  const paths = JSON.parse(pathsSource);
  const renderedRoutes = new Map(
    manifest.routes.map(({ route, status }) => [route, status]),
  );

  assert.equal(renderedRoutes.get("/"), "rendered");
  assert.equal(renderedRoutes.get("/virtual"), "rendered");
  assert.equal(renderedRoutes.get("/mine-logic"), "rendered");
  assert.equal(renderedRoutes.get("/velsien-summit"), "rendered");
  assert.equal(renderedRoutes.get("/velsien-summit/world"), "rendered");
  assert.equal(renderedRoutes.has("/velsien-summit/late-update"), false);
  assert.equal(renderedRoutes.get("/velsien-summit/secret"), "rendered");
  assert.equal(renderedRoutes.get("/velsien-summit/corporate/orysen"), "rendered");
  assert.equal(renderedRoutes.get("/velsien-summit/corporate/virenta"), "rendered");
  assert.equal(renderedRoutes.get("/velsien-summit/corporate/neryx"), "rendered");
  assert.equal(renderedRoutes.get("/privacy"), "rendered");
  assert.equal(renderedRoutes.get("/privacy/mine-logic"), "rendered");
  assert.equal(renderedRoutes.get("/privacy/archive/2026-08-22"), "rendered");
  assert.equal(renderedRoutes.get("/privacy/archive/2026-08-23"), "rendered");
  assert.equal(renderedRoutes.get("/privacy/archive/2026-08-28"), "rendered");
  assert.equal(renderedRoutes.get("/privacy/archive/2026-08-31"), "rendered");
  assert.equal(renderedRoutes.get("/privacy/archive/2026-09-05"), "rendered");
  assert.deepEqual(
    [...paths.paths].sort(),
    [
      "/",
      "/virtual",
      "/mine-logic",
      "/privacy",
      "/privacy/archive/2026-08-22",
      "/privacy/archive/2026-08-23",
      "/privacy/archive/2026-08-28",
      "/privacy/archive/2026-08-31",
      "/privacy/archive/2026-09-05",
      "/privacy/mine-logic",
      "/velsien-summit",
      "/velsien-summit/corporate/neryx",
      "/velsien-summit/corporate/orysen",
      "/velsien-summit/corporate/virenta",
      "/velsien-summit/secret",
      "/velsien-summit/world",
    ].sort(),
  );
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
  assert.match(
    mineLogic,
    /<title>MINE LOGIC\(마인로직\) \| Android 오프라인 지뢰찾기 · 단계별 힌트 · 20단계 훈련<\/title>/i,
  );
  assert.match(
    velsienSummit,
    /<title>VELSIEN SUMMIT\(벨시엔 서밋\) \| 모바일 캐릭터 수집형 전략 RPG<\/title>/i,
  );
  assert.match(velsienWorld, /<title>[^<]*(?:벨시엔 서밋|VELSIEN SUMMIT)[^<]*세계관[^<]*<\/title>|<title>[^<]*세계관[^<]*(?:벨시엔 서밋|VELSIEN SUMMIT)[^<]*<\/title>/i);
  assert.match(
    velsienSecret,
    /<title>벨시엔 서밋 시각 자료 보관 \| ERSIYAN<\/title>/i,
  );
  assert.match(privacyPolicy, /<title>개인정보처리방침 \| 에르시안<\/title>/i);
  assert.match(mineLogicPrivacyPolicy, /<title>MINE LOGIC Privacy Policy \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy, /<title>개인정보처리방침 2026년 8월 22일 보관본 \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy20260823, /<title>개인정보처리방침 2026년 8월 23일 보관본 \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy20260828, /<title>개인정보처리방침 2026년 8월 28일 보관본 \| 에르시안<\/title>/i);
  assert.match(archivedPrivacyPolicy20260831, /<title>개인정보처리방침 2026년 8월 31일 보관본 \| 에르시안<\/title>/i);
  assert.equal(staticHomepage, homepage);
  assert.equal(staticVirtual, virtual);
  assertPageMetadata(staticVirtual, "/virtual");
  assert.equal(staticMineLogic, mineLogic);
  assert.equal(staticVelsienSummit, velsienSummit);
  assert.equal(staticVelsienWorld, velsienWorld);
  assert.equal(staticVelsienSecret, velsienSecret);
  assert.equal(staticPrivacyPolicy, privacyPolicy);
  assert.equal(staticMineLogicPrivacyPolicy, mineLogicPrivacyPolicy);
  assert.equal(staticArchivedPrivacyPolicy, archivedPrivacyPolicy);
  assert.equal(staticArchivedPrivacyPolicy20260823, archivedPrivacyPolicy20260823);
  assert.equal(staticArchivedPrivacyPolicy20260828, archivedPrivacyPolicy20260828);
  assert.equal(staticArchivedPrivacyPolicy20260831, archivedPrivacyPolicy20260831);
  assert.equal(staticArchivedPrivacyPolicy20260905, archivedPrivacyPolicy20260905);
  assert.match(staticNotFound, /<title>에르시안<\/title>/i);
  for (const publicHtml of [
    staticHomepage,
    staticVirtual,
    staticMineLogic,
    staticVelsienSummit,
    staticVelsienWorld,
    staticVelsienSecret,
    staticPrivacyPolicy,
    staticMineLogicPrivacyPolicy,
    staticArchivedPrivacyPolicy,
    staticArchivedPrivacyPolicy20260823,
    staticArchivedPrivacyPolicy20260828,
    staticArchivedPrivacyPolicy20260831,
    staticArchivedPrivacyPolicy20260905,
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
  assert.doesNotMatch(staticMineLogic, /\/_next\/image\?/);
  assert.match(
    staticHomepage,
    /<link\b(?=[^>]*rel="preload")(?=[^>]*devlog-20260905-city-960\.webp)[^>]*>/i,
  );
  assert.doesNotMatch(staticVelsienSummit, /\/_next\/image\?/);
  assert.doesNotMatch(staticVelsienWorld, /\/_next\/image\?/);
  assert.doesNotMatch(staticVelsienSecret, /\/_next\/image\?/);
  assert.doesNotMatch(staticPrivacyPolicy, /\/_next\/image\?/);
  assert.doesNotMatch(staticMineLogicPrivacyPolicy, /\/_next\/image\?/);
});

test("server-renders the current public VELSIEN world overview", async () => {
  const response = await render("/velsien-summit/world");
  assert.equal(response.status, 200);

  const html = await response.text();
  const metadata = assertPageMetadata(html, "/velsien-summit/world");
  assert.match(metadata.title, /(?:벨시엔 서밋|VELSIEN SUMMIT)/i);
  assert.match(metadata.title, /세계관/);
  assert.doesNotMatch(html, /<meta\b[^>]*name="robots"[^>]*content="[^"]*\b(?:noindex|nofollow|none)\b/i);
  const nodes = structuredNodes(html);
  const page = nodes.find((node) => node["@type"] === "WebPage" && node.url === metadata.url);
  const article = nodes.find((node) => node["@type"] === "Article" && node.url === metadata.url);
  const breadcrumb = nodes.find((node) => node["@type"] === "BreadcrumbList" && node["@id"] === `${metadata.url}#breadcrumb`);
  assert.ok(page && article && breadcrumb, "The world page publishes linked article and breadcrumb data");
  assert.equal(page.mainEntity["@id"], article["@id"]);
  assert.equal(page.dateModified, "2026-09-20");
  assert.equal(article.datePublished, "2026-09-19");
  assert.equal(article.dateModified, "2026-09-20");
  assert.equal(breadcrumb.itemListElement.at(-1).item, metadata.url);
  const text = visibleText(html);
  for (const term of ["세계관", "순수인간", "평생계약", "오리센", "비렌타", "네릭스"]) {
    assert.ok(text.includes(term), `The public world overview explains ${term}`);
  }
  assert.match(text, /2026[-.년\s]*0?9[-.월\s]*19/);
  assert.match(text, /2026[-.년\s]*0?9[-.월\s]*20/);
  assert.match(text, /0\.9%/);
  assert.match(text, /군사력도\s*거의\s*대등/);
  assert.doesNotMatch(text, /다른 기업으로 옮기는 일은 가능합니다/);
  assert.match(text, /접객과 간병, 교육, 물류/);
  assert.match(text, /특정 AI가 없으면 계약을 진행할 수 없는 필수 조건/);
  assert.match(html, /href="\/velsien-summit"/);
  for (const company of ["orysen", "virenta", "neryx"]) {
    assert.match(html, new RegExp(`href="/velsien-summit/corporate/${company}"`));
  }

  const overviewResponse = await render("/velsien-summit");
  assert.equal(overviewResponse.status, 200);
  assert.match(await overviewResponse.text(), /href="\/velsien-summit\/world"/);
});

test("keeps the unique late-August screens in the VELSIEN development journal", async () => {
  const response = await render("/velsien-summit");
  assert.equal(response.status, 200);

  const html = await response.text();
  const metadata = assertPageMetadata(html, "/velsien-summit");
  const nodes = structuredNodes(html);
  const page = nodes.find((node) => node["@type"] === "WebPage" && node.url === metadata.url);
  const article = nodes.find((node) => node["@type"] === "Article" && node.url === `${metadata.url}#devlog-2026-08-late`);
  assert.ok(page && article, "The dated August archive is part of the game page");
  assert.ok(page.hasPart.some((part) => part["@id"] === article["@id"]));
  assert.equal(article.temporalCoverage, "2026-08");
  assert.equal(article.datePublished, undefined, "The original August publication day is unknown");
  assert.equal(article.dateModified, undefined);
  assert.equal(article.author.name, "ERSIYAN GAMES");
  assert.ok(visibleText(html).includes(article.headline));
  assert.match(html, /id="devlog-2026-08-late"/);
  assert.match(html, /href="#devlog-2026-08-late"/);
  assert.match(html, /href="\/velsien-summit\/world"/);
  assert.doesNotMatch(html, /href="\/velsien-summit\/late-update"/);

  for (const image of [
    "late-update-operation.webp",
    "late-update-gacha.webp",
    "late-update-formation.webp",
  ]) {
    assert.match(
      html,
      new RegExp(
        `<img\\b(?=[^>]*src="/images/velsien-summit/${image.replace(".", "\\.")}")(?=[^>]*alt="[^"]+")(?=[^>]*loading="lazy")[^>]*>`,
        "i",
      ),
    );
    const imageTag = [...html.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => attributes(tag))
      .find(({ src }) => src === `/images/velsien-summit/${image}`);
    assert.equal(Number(imageTag.width) / Number(imageTag.height), 960 / 455);
    assert.equal(imageTag.loading, "lazy");
    for (const width of [400, 640]) {
      assert.ok(imageTag.srcset.includes(`${image.replace(".webp", `-${width}.webp`)} ${width}w`));
    }
    assert.ok(imageTag.srcset.includes(`${image} 960w`));
    assert.ok(imageTag.sizes);
  }
});

test("Virtual has a complete server-rendered route without the Games panel", async () => {
  const response = await render("/virtual?utm_source=virtual");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertPageMetadata(html, "/virtual");
  const description = metaContent(html, "description");
  assert.ok(description.length >= 120 && description.length <= 160, "Virtual search description stays concise and specific");
  assert.match(description, /0기 소속 크리에이터 1명을 모집합니다/);
  assert.equal(metaContent(html, "og:image"), "https://ersiyan.com/ersiyan-virtual-gen0-social-card.png");
  assert.equal(metaContent(html, "og:image:alt"), "에르시안 버츄얼 0기 크리에이터 모집 안내");
  assertDivisionLinks(html, "virtual");
  assert.equal(html.match(/<h1\b/gi)?.length, 1);
  assert.match(html, /<h1\b[^>]*id="virtual-title"/i);
  assert.doesNotMatch(html, /<h1\b[^>]*class="home-page-title"/i);
  assert.match(html, /<section\b(?=[^>]*id="ersiyan-virtual-view")(?![^>]*\bhidden)[^>]*>/i);
  const virtualStart = html.indexOf('id="ersiyan-virtual-view"');
  const companyStart = html.indexOf('id="ersiyan-company-view"', virtualStart);
  assert.ok(virtualStart >= 0 && companyStart > virtualStart, "Virtual and shared company sections are separate");
  // Scope these checks to the Virtual section; the shared navigation, history, and footer may link to Games.
  const virtualSection = html.slice(virtualStart, companyStart);
  const virtualText = visibleText(virtualSection);
  assert.match(virtualText, /에르시안 버츄얼은 첫 소속 크리에이터 한 분을 모집합니다/);
  assert.match(virtualText, /0기 크리에이터 지원 접수 중/);
  assert.match(virtualText, /모집 중/);
  assert.match(virtualText, /모집 인원\s*1명/);
  assert.match(virtualText, /첫 소속 크리에이터\s*한 분을 모집합니다/);
  assert.match(virtualText, /지원 후 곧바로 방송을 시작하는 모집이 아닙니다/);
  assert.match(virtualText, /구체적인 시작일은 함께 준비한 뒤 정합니다/);
  assert.match(virtualText, /지원이 곧 활동 시작은 아닙니다/);
  assert.match(virtualText, /구체적인 조건은 최종 결정 전에 문서로 안내하고 검토할 시간을 드립니다/);
  assert.doesNotMatch(virtualText, /에르시안을 처음 만났다면|RELEASED GAME|IN DEVELOPMENT|MINE LOGIC|VELSIEN SUMMIT/);
  assert.doesNotMatch(virtualSection, /href="\/(?:mine-logic|velsien-summit)"/i);
  assert.doesNotMatch(virtualText, /70\s*\/\s*30|50\s*\/\s*50|월 12회 이상|첫 계약은 1년|대여 장비는 계약 종료/);
  assert.match(virtualSection, /href="#virtual-apply"/);
  assert.match(virtualSection, /href="mailto:biz@ersiyan\.com\?subject=[^"]+"/);
  assert.match(virtualSection, /subject=ERSIYAN%20VIRTUAL%200%EA%B8%B0%20%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0%20%EC%A7%80%EC%9B%90/);
  const applySection = html.match(/<section\b[^>]*id="virtual-apply"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
  assert.ok(applySection, "Application details are visible in the public route");
  for (const term of ["만 19세 이상", "3~5분 자유 음성 파일", "30일 이내 삭제"]) {
    assert.ok(visibleText(applySection).includes(term), `Recruitment explains ${term}`);
  }
  assert.match(applySection, /href="\/privacy"/);
  assert.match(applySection, /href="mailto:biz@ersiyan\.com\?subject=[^"]+"/);
  assert.doesNotMatch(html, /<section\b[^>]*id="ersiyan-games-view"/i);
  assert.doesNotMatch(html, /id="(?:games|studio|game-tab-mine-logic|game-tab-velsien)"/i);
  assert.doesNotMatch(html, /<img\b[^>]*src="\/images\/(?:mine-logic|velsien-summit)\//i);
  assert.doesNotMatch(html, /<link\b(?=[^>]*rel="preload")(?=[^>]*\/(?:mine-logic|velsien-summit)\/)[^>]*>/i);
  assert.match(html, /id="ersiyan-company-view"/);
  assert.match(html, /id="company-history"/);
  assert.match(html, /id="business-info"/);
  assert.match(html, /에르시안 사업자 정보/);
  assert.doesNotMatch(html, /href="\/velsien-summit\/secret"/i);
});

test("both division documents identify the same parent and equal departments", async () => {
  for (const pathname of ["/", "/virtual"]) {
    const html = await (await render(pathname)).text();
    const nodes = structuredNodes(html);
    const company = nodes.find((node) => node["@id"] === "https://ersiyan.com/#organization");
    const page = nodes.find((node) => node["@type"] === "WebPage");
    const departments = company.department.map(({ "@id": id }) => nodes.find((node) => node["@id"] === id));
    assert.equal(company["@type"], "Organization");
    assert.equal(company.name, "에르시안");
    assert.equal(company.legalName, "에르시안");
    assert.equal(company.email, "help@ersiyan.com");
    assert.deepEqual(departments.map(({ name }) => name), ["ERSIYAN GAMES", "ERSIYAN VIRTUAL"]);
    assert.deepEqual(departments.map(({ url }) => url), ["https://ersiyan.com/", "https://ersiyan.com/virtual"]);
    assert.equal(departments[1].email, "biz@ersiyan.com");
    assert.deepEqual(departments[1].contactPoint, {
      "@type": "ContactPoint",
      contactType: "recruitment",
      email: "biz@ersiyan.com",
    });
    for (const department of departments) {
      assert.equal(department["@type"], "Organization");
      assert.equal(department.parentOrganization["@id"], company["@id"]);
      assert.equal(department.legalName, undefined);
      assert.equal(department.foundingDate, undefined);
    }
    assert.equal(page.url, `https://ersiyan.com${pathname}`);
    assert.equal(page.description, metaContent(html, "description"));
    assert.equal(page.about["@id"], pathname === "/" ? company["@id"] : departments[1]["@id"]);
  }
});

test("server-renders the searchable but unlisted VELSIEN secret archive", async () => {
  const [response, homepageResponse, velsienResponse] =
    await Promise.all([
      render("/velsien-summit/secret"),
      render("/"),
      render("/velsien-summit"),
    ]);
  assert.equal(response.status, 200);

  const [html, homepage, velsien] = await Promise.all([
    response.text(),
    homepageResponse.text(),
    velsienResponse.text(),
  ]);

  assertPageMetadata(html, "/velsien-summit/secret");
  const socialImageUrl = "https://ersiyan.com/images/velsien-summit/velsien-summit-social.jpg";
  assert.equal(metaContent(html, "og:image"), socialImageUrl);
  assert.equal(metaContent(html, "twitter:image"), socialImageUrl);
  await access(new URL(`../public${new URL(socialImageUrl).pathname}`, import.meta.url));
  assert.match(html, /시각 자료 보관/);
  assert.match(html, /캐릭터 설정화/);
  assert.match(html, /전투 화면/);
  assert.match(html, /이전 개발 화면/);
  assert.match(html, /이 자료는 현재 개발 상태와 다를 수 있습니다/);
  for (const number of ["01", "02", "03", "04"]) {
    assert.match(html, new RegExp(`이전 개발 화면 ${number}`));
  }
  assert.match(
    html,
    /rel="canonical" href="https:\/\/ersiyan\.com\/velsien-summit\/secret"/i,
  );
  assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/i);
  assert.equal(
    html.match(/src="\/images\/velsien-summit\/secret\/[^"]+\.webp"/g)?.length ?? 0,
    8,
  );
  for (const name of [
    "Nika Oren",
    "Luena Havel",
    "Serin Noer",
    "Pia Morel",
    "Kael Droen",
    "Shaped Charge",
    "Prism Orbits",
    "Percussion Rings",
  ]) {
    assert.match(html, new RegExp(name));
  }

  for (const publicPage of [homepage, velsien]) {
    assert.doesNotMatch(
      publicPage,
      /href="\/velsien-summit\/secret"/i,
    );
  }
});

test("server-renders Games with equal division links and parent company information", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(
    html,
    /<title>에르시안\(ERSIYAN\) · 게임 개발과 운영<\/title>/i,
  );
  assert.match(html, homepageHeroPattern);
  assertDivisionLinks(html, "games");
  assert.match(
    html,
    /<a\b(?=[^>]*class="company-view-button")(?=[^>]*href="#ersiyan-company-view")[^>]*>회사 정보<\/a>/i,
  );
  assert.doesNotMatch(html, /<section\b[^>]*id="ersiyan-virtual-view"/i);
  const gamesStart = html.search(/<section\b[^>]*id="ersiyan-games-view"/i);
  const companyStart = html.search(/<section\b[^>]*id="ersiyan-company-view"/i);
  assert.ok(gamesStart >= 0 && companyStart > gamesStart);
  // Shared company history may describe Virtual; its project belongs outside the Games division.
  assert.doesNotMatch(html.slice(gamesStart, companyStart), /PROJECT 001/);
  assert.match(
    html,
    /<section\b(?=[^>]*id="ersiyan-company-view")[^>]*>[\s\S]*?에르시안 회사 정보/i,
  );
  assert.equal(html.match(/<h1\b/g)?.length, 1);
  assert.match(html, /두 사업 영역으로[\s\S]*?둔 회사이자 브랜드입니다/);
  assert.doesNotMatch(html, /company-overview|brand-intro|brand-hierarchy|하나의 에르시안/);
  assert.doesNotMatch(html, /role="tablist" aria-label="사업부 선택"/i);
  assert.doesNotMatch(html, /<section\b(?=[^>]*id="ersiyan-(?:games|company)-view")(?=[^>]*\bhidden)[^>]*>/i);
  assert.match(html, /<h2 id="games-intro-title">직접 만든 게임을<br\s*\/?><span>출시하고 운영합니다\.<\/span><\/h2>/i);
  assert.match(html, /<details\b(?=[^>]*id="company-history")[^>]*>/i);
  assert.match(html, /Company History/);
  assert.match(html, /에르시안 연혁/);
  assert.equal(html.match(/data-history-milestone="[^"]+"/g)?.length ?? 0, 8);
  for (const milestone of [
    "MINE LOGIC 첫 출시",
    "개인사업자 개업",
    "공식 홈페이지 공개",
    "통신판매업 신고",
    "게임제작업자 등록",
    "ERSIYAN 브랜드 전환",
    "법정 상호 에르시안 변경",
  ]) {
    assert.match(html, new RegExp(milestone));
  }
  assert.match(
    html,
    /에르시안의 게임 개발·운영 부문입니다\.[\s\S]*MINE LOGIC을 출시했고[\s\S]*VELSIEN SUMMIT을 개발하고 있습니다/,
  );
  assert.match(html, /작품 둘러보기/);
  assert.match(html, /게임을 선택해 화면과 소개를 둘러보세요/);
  assert.match(html, /OUR GAMES · 01/);
  assert.match(html, /게임을 만들 때[\s\S]*신경 쓰는 것/);
  assert.match(html, /MINE LOGIC/);
  assert.match(html, /href="\/mine-logic"/i);
  assert.match(html, /MINE LOGIC 자세히 보기/);
  assert.match(html, /feature-480\.webp 480w/i);
  assert.match(html, /feature-768\.webp 768w/i);
  assert.match(html, /06_lobby-360\.webp 360w/i);
  assert.doesNotMatch(html, /src="\/images\/mine-logic\/(?:02_hint|03_training)\.png"/i);
  assert.match(html, /VELSIEN SUMMIT/);
  assert.match(html, /com\.applepie\.minelogic/);
  assert.match(html, /mailto:help@ersiyan\.com/);
  assert.match(html, /개인사업자 에르시안이 운영하는 공식 홈페이지입니다/);
  assert.match(html, /aria-label="에르시안 사업자 정보"/);
  assert.match(html, /<dt>상호<\/dt>[\s\S]*?<dd>에르시안<\/dd>/);
  assert.doesNotMatch(html, /ERSIYAN은 애플파이가 운영하는 브랜드입니다/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-selected="true"/);
  assert.doesNotMatch(html, /사업자 정보 펼쳐보기/);
  assert.ok((html.match(/<a\b[^>]*href="\/velsien-summit"[^>]*>/gi)?.length ?? 0) >= 1);
  assert.match(html, /VELSIEN SUMMIT 자세히 보기/);
  assert.match(html, /SNEAK PEEK/);
  assert.match(html, /MOBILE · COLLECTIBLE · STRATEGY RPG/);
  assert.match(html, /세계관 신호/);
  assert.match(html, /WORLD FILE \/\/ WORK IN PROGRESS/);
  assert.match(html, /만들어 가는 세계의 일부를 먼저 소개합니다/);
  assert.match(html, /아름답게 돌아가는 미래도시/);
  assert.match(html, /어느 기업에도 묶이지 않은 계약자/);
  assert.match(html, /세 개의 기업 채널/);
  assert.match(html, /MORE DATA LOCKED UNTIL NEXT DEV LOG/);
  assert.equal(
    html.match(/id="game-tab-(?:mine-logic|velsien)"/g)?.length ?? 0,
    2,
  );
  assert.equal(
    html.match(/id="velsien-mode-tab-(?:art|scenes|world)"/g)?.length ?? 0,
    3,
  );
  assert.equal(
    html.match(/id="velsien-scene-(?:title|lobby|character)"/g)?.length ?? 0,
    3,
  );
  assert.equal(
    html.match(
      /<button\b(?=[^>]*id="velsien-scene-(?:title|lobby|character)")(?=[^>]*aria-pressed="true")[^>]*>/g,
    )?.length ?? 0,
    1,
  );
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
  assert.match(html, /tel:\+821024166267/);
  assert.match(html, /Cloudflare, Inc\./);
  assert.match(html, /bizCommPop\.do\?wrkr_no=2064362580/);
  assert.match(html, /공정위 신고 조회/);
  assert.doesNotMatch(html, /사업자정보확인|<dt>업태<\/dt>|<dt>종목<\/dt>/);
  assert.match(html, /이 홈페이지에서는 주문이나 결제를 받지 않으며, 앱 설치와 거래는 Google Play에서 진행됩니다/);
  assert.match(html, /ersiyan-social-card\.jpg/);
  assert.match(html, /type="application\/ld\+json"/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"name":"에르시안"/);
  assert.match(html, /"legalName":"에르시안"/);
  assert.match(html, /"alternateName":"ERSIYAN"/);
  assert.match(html, /"foundingDate":"2026-08-19"/);
  assert.match(
    html,
    /"contentUrl":"https:\/\/ersiyan\.com\/images\/brand\/ersiyan-logo-hero\.webp"/,
  );
  assert.match(
    html,
    /name="twitter:image:alt" content="에르시안\(ERSIYAN\) 로고"/i,
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

test("server-renders the MINE LOGIC product page", async () => {
  const response = await render("/mine-logic?utm_source=google");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const metadata = assertPageMetadata(html, "/mine-logic");
  const nodes = structuredNodes(html);
  const app = nodes.find((node) => node["@id"] === `${metadata.url}#app`);
  const page = nodes.find((node) => node["@type"] === "WebPage");
  const text = visibleText(html);
  assert.equal(page.url, metadata.url);
  assert.equal(page.name, metadata.title);
  assert.equal(page.description, metadata.description);
  assert.equal(page.mainEntity["@id"], app["@id"]);
  assert.equal(page.breadcrumb["@type"], "BreadcrumbList");
  assert.equal(page.breadcrumb.itemListElement.at(-1).item, metadata.url);
  assert.ok(text.includes(`v${app.softwareVersion}`), "Visible release version matches the app schema");
  assert.ok(text.includes(app.contentRating), "Visible content rating matches the app schema");
  assert.equal(app.offers.price, 0);
  assert.ok(text.includes("무료"));
  const languages = new Map([
    ["ko", "한국어"], ["en", "영어"], ["ja", "일본어"],
    ["zh-Hans", "중국어 간체"], ["zh-Hant", "중국어 번체"],
    ["es", "스페인어"], ["pt-BR", "포르투갈어(브라질)"], ["th", "태국어"],
    ["id", "인도네시아어"], ["fr", "프랑스어"], ["de", "독일어"], ["ar", "아랍어"],
  ]);
  assert.deepEqual([...app.inLanguage].sort(), [...languages.keys()].sort());
  assert.ok(text.includes(`${app.inLanguage.length}개 언어 지원`));
  for (const code of app.inLanguage) assert.ok(text.includes(languages.get(code)), `Visible language ${code}`);
  assert.match(html, /<time\b[^>]*datetime="2026-09-05"[^>]*>2026년 9월 5일<\/time>/i);
  assert.match(html, /<time\b[^>]*datetime="2026-08-28"[^>]*>2026년 8월 28일<\/time>/i);
  assert.match(
    html,
    /<title>MINE LOGIC\(마인로직\) \| Android 오프라인 지뢰찾기 · 단계별 힌트 · 20단계 훈련<\/title>/i,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/ersiyan\.com\/mine-logic"/i,
  );
  assert.match(
    html,
    /property="og:url" content="https:\/\/ersiyan\.com\/mine-logic"/i,
  );
  assert.match(html, /지뢰찾기, 막히면[\s\S]*이유를 보고 풉니다/);
  assert.match(html, /9 × 9 · 지뢰 10개/);
  assert.match(html, /16 × 16 · 지뢰 40개/);
  assert.match(html, /30 × 16 · 지뢰 99개/);
  assert.match(html, /일반훈련 1~15단계/);
  assert.match(html, /강화훈련 16~20단계/);
  assert.match(html, /Android INTERNET 권한을 요청하지 않습니다/);
  assert.match(html, /href="https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.applepie\.minelogic"/i);
  assert.match(html, /href="\/privacy\/mine-logic"/i);
  assert.match(html, /mailto:help@ersiyan\.com/i);
  assert.match(html, /"@type":\["VideoGame","MobileApplication"\]/);
  assert.match(html, /"softwareVersion":"1\.3\.3"/);
  assert.match(html, /"publisher":\{"@id":"https:\/\/ersiyan\.com\/#organization"\}/);
  assert.match(html, /"offers":\{"@type":"Offer","url":"https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.applepie\.minelogic","price":0,"priceCurrency":"KRW","availability":"https:\/\/schema\.org\/InStock"\}/);
  assert.doesNotMatch(html, /"aggregateRating"|"review"/);
  for (const prefix of ["06_lobby", "02_hint", "03_training"]) {
    assert.match(html, new RegExp(`${prefix}-360\\.webp 360w`, "i"));
    assert.match(html, new RegExp(`${prefix}-720\\.webp 720w`, "i"));
  }
  assert.match(html, /feature-480\.webp 480w/i);
  assert.match(html, /feature-1024\.webp 1024w/i);
  assert.match(
    html,
    /<img\b(?=[^>]*src="\/images\/mine-logic\/02_hint\.png")(?=[^>]*fetchpriority="high")[^>]*>/i,
  );
  assert.equal(html.match(/<h1\b/gi)?.length ?? 0, 1);
  assert.doesNotMatch(html, /\/_next\/image\?/i);
});

test("server-renders the VELSIEN SUMMIT promotional page", async () => {
  const response = await render("/velsien-summit?utm_source=naver");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const metadata = assertPageMetadata(html, "/velsien-summit");
  const nodes = structuredNodes(html);
  const page = nodes.find((node) => node["@type"] === "WebPage");
  const breadcrumb = nodes.find((node) => node["@type"] === "BreadcrumbList");
  const articles = nodes.filter((node) => node["@type"] === "Article");
  assert.equal(page.url, metadata.url);
  assert.equal(page.name, metadata.title);
  assert.equal(page.description, metadata.description);
  assert.equal(page.mainEntity["@id"], `${metadata.url}#game`);
  assert.equal(page.breadcrumb["@id"], breadcrumb["@id"]);
  assert.equal(breadcrumb.itemListElement.at(-1).item, metadata.url);
  assert.deepEqual(page.hasPart.map((part) => part["@id"]), articles.map((article) => article["@id"]));
  assert.equal(articles.length, 4);
  for (const article of articles) {
    const anchor = new URL(article.url).hash.slice(1);
    assert.ok(html.includes(`id="${anchor}"`), "Every article resolves to a visible record");
    assert.equal(article.author.name, "ERSIYAN GAMES");
    assert.equal(article.publisher["@id"], "https://ersiyan.com/#organization");
    assert.equal(article.about["@id"], `${metadata.url}#game`);
    assert.equal(article.isPartOf["@id"], page["@id"]);
    if (anchor === "screens" || anchor === "devlog-2026-08-late") {
      assert.equal(article.temporalCoverage, "2026-08");
      assert.equal(article.datePublished, undefined, "August screen capture days are not invented");
      assert.equal(article.dateModified, undefined);
    } else {
      assert.equal(article.datePublished, "2026-09-05");
      assert.equal(article.dateModified, "2026-09-05");
    }
  }
  const recordIds = ["devlog-2026-09-05-battle", "devlog-2026-09-05", "devlog-2026-08-late", "screens"];
  const recordPositions = recordIds.map((id) => html.indexOf(`id="${id}"`));
  assert.ok(recordPositions.every((position) => position >= 0));
  assert.deepEqual(recordPositions, [...recordPositions].sort((a, b) => a - b), "Records remain newest first");
  for (const id of recordIds) assert.ok(html.includes(`href="#${id}"`));
  for (const id of ["01", "02"]) {
    const prefix = `/images/velsien-summit/devlog-20260905-battle-${id}`;
    const image = [...html.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => attributes(tag))
      .find(({ src, loading }) => src === `${prefix}-960.webp` && loading === "lazy");
    assert.ok(image, `Battle screen ${id} is rendered`);
    assert.equal(Number(image.width) / Number(image.height), 16 / 9);
    assert.equal(image.loading, "lazy");
    assert.ok(image.alt);
    for (const width of [640, 960, 1920]) assert.ok(image.srcset.includes(`${prefix}-${width}.webp ${width}w`));
    const fullSize = [...html.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attributes(tag))
      .filter(({ href }) => href === `${prefix}-1920.webp`);
    assert.ok(fullSize.length > 0);
    assert.ok(fullSize.every((link) => link.target === "_blank"
      && (link.rel ?? "").split(/\s+/).some((token) => token === "noopener" || token === "noreferrer")),
    "Full-size images open separately without an opener reference");
  }
  assert.match(html, /<img\b(?=[^>]*src="\/images\/velsien-summit\/devlog-20260905-battle-01-960\.webp")(?=[^>]*loading="eager")(?=[^>]*fetchPriority="high")[^>]*>/i);
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(
    html,
    /<title>VELSIEN SUMMIT\(벨시엔 서밋\) \| 모바일 캐릭터 수집형 전략 RPG<\/title>/i,
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
  assert.match(html, /모바일 캐릭터 수집형 전략 RPG/);
  assert.match(html, /개발 중이며 출시 미정입니다/);
  assert.match(html, /<h1[^>]*>[\s\S]*VELSIEN[\s\S]*SUMMIT[\s\S]*벨시엔 서밋[\s\S]*<\/h1>/i);
  assert.match(html, /IN DEVELOPMENT/);
  assert.match(html, /개발 중 · 출시 미정/);
  assert.match(html, /기술이 너무 잘 작동하는 도시/);
  assert.match(html, /어느 기업에도 속하지 않은 계약자/);
  assert.match(html, /8월의 개발 화면/);
  assert.match(html, /벨시엔이라는 도시/);
  assert.match(html, /전투는 준비에서 갈립니다/);
  assert.match(html, /role="tablist" aria-label="개발 중 화면 선택"/i);
  assert.match(html, /role="tablist" aria-label="벨시엔 세계관 주제 선택"/i);
  assert.match(html, /role="tablist" aria-label="게임 진행 단계 선택"/i);
  assert.match(html, /aria-orientation="horizontal"/i);
  assert.match(html, /개발에 사용 중인 도시 배경 아트입니다/);
  assert.match(html, /이름과 개발 수치는 일부 흐리게 처리했으며/);
  assert.match(html, /<time dateTime="2026-09-05">2026\.09\.05<\/time>/i);
  assert.match(html, /작성 당시의 구상과 작업/);
  assert.match(html, /3D 표현으로 옮기는 작업도 진행하고 있습니다/);
  for (const name of ["루에나 하벨", "레시아 벨른", "세린 노에르"]) {
    assert.match(html, new RegExp(name));
  }
  assert.match(html, /id="characters"/);
  assert.match(html, /동행자의 얼굴들/);
  assert.match(html, /devlog-20260905-lesia-360\.webp 360w/);
  assert.match(html, /devlog-20260905-serin-360\.webp 360w/);
  assert.match(html, /devlog-20260905-city-640\.webp 640w/);
  assert.match(html, /devlog-20260905-sunlit-960\.webp 960w/);
  assert.match(html, /devlog-20260905-luena-360\.webp 360w/);
  assert.match(html, /id="devlog-2026-08-late"/);
  assert.doesNotMatch(html, /href="\/velsien-summit\/late-update"/);
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
    /사전예약|출시일\s*20\d{2}|Lesia|Nael/,
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
  assertPageMetadata(html, "/privacy");
  assert.match(html, /<title>개인정보처리방침 \| 에르시안<\/title>/i);
  assert.match(html, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy"/i);
  assert.match(html, /회원가입과 문의 양식을 제공하지 않으며/);
  assert.match(html, /help@ersiyan\.com/);
  assert.match(html, /게임 앱 정책/);
  assert.match(html, /Workers Static Assets/);
  assert.match(html, /최근 변경일 및 시행일 2026년 9월 19일/);
  assert.match(html, /href="\/privacy\/archive\/2026-09-05"/);
  const recruitmentNotice = visibleText(policySection(html, "recruitment-notice"));
  assert.match(recruitmentNotice, /에르시안 버츄얼 크리에이터 모집 지원 정보/);
  assert.match(recruitmentNotice, /일반 문의와 홈페이지 방문 정보에 관한 기존 안내는 유지합니다/);
  const collection = visibleText(policySection(html, "collection"));
  for (const term of ["biz@ersiyan.com", "만 19세 이상", "3~5분 음성 파일", "실제 얼굴 사진이나 신분증 사본"]) {
    assert.match(collection, new RegExp(term));
  }
  const purpose = visibleText(policySection(html, "purpose"));
  for (const term of ["선발 심사에만 사용", "AI 학습이나 홍보 콘텐츠", "최종 선정일로부터", "선정 없이 모집을 취소하거나 종료하면", "지원을 철회", "계약과 정산 절차"]) {
    assert.match(purpose, new RegExp(term));
  }
  assert.match(html, /href="mailto:biz@ersiyan\.com"/);
  assert.match(html, /사업자명 변경/);
  assert.match(html, /상호가 애플파이에서[\s\S]*에르시안으로 변경/);
  assert.match(html, /개인사업자 에르시안\(대표자 탁진,[\s\S]*206-43-62580\)/);
  assert.match(html, /\/privacy\/archive\/2026-08-28/);
  assert.match(html, /href="\/privacy\/archive\/2026-08-31"/);
  const correction = visibleText(policySection(html, "change-notice"));
  assert.match(correction, /방문·성능 통계 안내 정정/);
  assert.match(correction, /이미 작동 중인 Cloudflare Web Analytics/);
  assert.match(correction, /새로운 방문자 분석 도구를 추가한 것은 아닙니다/);
  const oldNotice = visibleText(policySection(html, "business-name-notice"));
  assert.equal(createHash("sha256").update(oldNotice).digest("hex"), august31PolicySectionHashes["change-notice"]);
  const hosting = policySection(html, "hosting");
  assert.match(visibleText(hosting), /Cloudflare Web Analytics를 사용합니다/);
  for (const measurement of ["페이지 경로", "유입 경로", "국가", "브라우저·기기 종류", "성능 지표"]) {
    assert.ok(visibleText(hosting).includes(measurement), `Disclosed measurement ${measurement}`);
  }
  assert.match(hosting, /href="https:\/\/developers\.cloudflare\.com\/web-analytics\/data-metrics\/dimensions\/"/);
  assert.match(hosting, /href="https:\/\/developers\.cloudflare\.com\/web-analytics\/data-metrics\/core-web-vitals\/"/);
  const cookies = policySection(html, "cookies");
  assert.match(visibleText(cookies), /Cloudflare는 Web Analytics의 방문·성능 측정에 쿠키나 브라우저 저장소를 사용하지 않으며/);
  assert.match(visibleText(cookies), /지문 정보를 만들지 않는다고 공식 문서 에서 안내합니다/);
  assert.match(cookies, /href="https:\/\/developers\.cloudflare\.com\/web-analytics\/data-metrics\/core-web-vitals\/"/);
  assert.doesNotMatch(visibleText(hosting + cookies), /별도의 방문자 분석 도구를 추가하지 않으며|방문자 분석 도구를 사용하지 않습니다/);
  assert.match(html, /href="\/privacy\/mine-logic"[^>]*>MINE LOGIC 개인정보처리방침 보기<\/a>/);
  assert.doesNotMatch(html, /`applepie\.im`/);
});

test("server-renders the MINE LOGIC privacy policy", async () => {
  const response = await render("/privacy/mine-logic");
  assert.equal(response.status, 200);

  const html = await response.text();
  assertPageMetadata(html, "/privacy/mine-logic");
  assert.match(html, /<title>MINE LOGIC Privacy Policy \| 에르시안<\/title>/i);
  assert.match(html, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy\/mine-logic"/i);
  assert.match(html, /최초 시행일 2026년 7월 29일/);
  assert.match(html, /최근 변경일 및 시행일 2026년 8월\s*31일/);
  assert.match(html, /강화훈련에서 이미 제공한 문제의 이력/);
  assert.match(html, /결과 카드 이미지는 이용자의 기기에서 생성됩니다/);
  assert.match(html, /Android의 INTERNET 권한을 요청하지 않으며/);
  assert.match(html, /Cloudflare가 IP 주소와 접속 요청 정보를 처리할 수 있습니다/);
  assert.match(html, /MINE LOGIC Privacy Policy/);
  assert.match(html, /Last updated and effective August 31, 2026/);
  assert.match(html, /상호가 애플파이에서[\s\S]*에르시안으로 변경/);
  assert.match(html, /registered business name change[\s\S]*ApplePie[\s\S]*ERSIYAN/);
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
  assert.doesNotMatch(html, /document\.documentElement\.lang="en-US"/);
  assert.match(html, /aria-controls="mine-logic-policy-ko" aria-pressed="false"/);
  assert.match(html, /aria-controls="mine-logic-policy-en" aria-pressed="true"/);
  assert.match(html, /<button[^>]*aria-controls="mine-logic-policy-ko"[^>]*>한국어<\/button>/);
  assert.match(html, /<button[^>]*aria-controls="mine-logic-policy-en"[^>]*>English<\/button>/);
  assert.match(html, /<noscript>/);
  assert.match(html, /href="#mine-logic-policy-ko"[^>]*>한국어 개인정보처리방침으로 이동<\/a>/);
  assert.match(html, /#mine-logic-policy-ko\[hidden\][\s\S]*?display:\s*block\s*!important/);
  assert.match(html, /id="mine-logic-policy-ko" lang="ko-KR" hidden=""/);
  assert.match(html, /id="mine-logic-policy-en" lang="en-US"/);
  assert.doesNotMatch(html, /id="mine-logic-policy-en" lang="en-US" hidden/);
  assert.match(html, /href="\/"[^>]*>← 홈페이지로<\/a>/);
  assert.match(html, /href="\/privacy"[^>]*>개인정보처리방침<\/a>/);
  assert.doesNotMatch(html, /수집·저장·이용·공유하지|제3자 SDK 없음|삭제할 데이터 없음/);
});

test("server-renders the archived privacy policy", async () => {
  const response = await render("/privacy/archive/2026-08-22");
  assert.equal(response.status, 200);

  const html = await response.text();
  assertPageMetadata(html, "/privacy/archive/2026-08-22");
  assert.equal(metaContent(html, "robots"), "index, follow");
  assert.match(html, /개인정보처리방침 2026년 8월 22일 보관본/);
  assert.match(html, /사용하는 OpenAI Sites와 그 기반 서비스/);
  assert.match(html, /이 방침의 최초 시행일은 2026년 8월 22일입니다/);
  assert.doesNotMatch(html, /Cloudflare Workers Static Assets/);
});

test("server-renders the August 23 privacy policy archive", async () => {
  const response = await render("/privacy/archive/2026-08-23");
  assert.equal(response.status, 200);

  const html = await response.text();
  assertPageMetadata(html, "/privacy/archive/2026-08-23");
  assert.match(html, /개인정보처리방침 2026년 8월 23일 보관본/);
  assert.match(html, /홈페이지 호스팅 서비스 변경/);
  assert.match(html, /Cloudflare Workers Static Assets/);
  assert.match(html, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy\/archive\/2026-08-23"/i);
  assert.equal(metaContent(html, "robots"), "index, follow");
});

test("preserves the August 28 ApplePie privacy policy as a historical archive", async () => {
  const response = await render("/privacy/archive/2026-08-28");
  assert.equal(response.status, 200);

  const html = await response.text();
  assertPageMetadata(html, "/privacy/archive/2026-08-28");
  assert.match(html, /개인정보처리방침 2026년 8월 28일 보관본/);
  assert.match(html, /브랜드 및 공식 도메인 변경/);
  assert.match(html, /개인사업자 애플파이\(대표자 탁진,[\s\S]*206-43-62580\)/);
  assert.match(html, /applepie\.im에서[\s\S]*ersiyan\.com으로 이전/);
  assert.match(html, /rel="canonical" href="https:\/\/ersiyan\.com\/privacy\/archive\/2026-08-28"/i);
  assert.equal(metaContent(html, "robots"), "index, follow");
  assert.doesNotMatch(html, /id="change-notice-title">사업자명 변경<\/h2>/);
});

test("preserves the complete August 31 policy as a self-canonical searchable archive", async () => {
  const response = await render("/privacy/archive/2026-08-31?utm_source=history");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertPageMetadata(html, "/privacy/archive/2026-08-31");
  assert.equal(metaContent(html, "robots"), "index, follow");
  assert.match(html, /개인정보처리방침 2026년 8월 31일 보관본/);
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /사업자명 변경/);
  assert.match(html, /개인사업자 에르시안\(대표자 탁진,[\s\S]*206-43-62580\)/);
  assert.match(html, /현재 홈페이지는 자체 광고 쿠키나 방문자 분석 도구를 사용하지 않습니다/);
  for (const [id, expectedHash] of Object.entries(august31PolicySectionHashes)) {
    const text = visibleText(policySection(html, id));
    assert.equal(createHash("sha256").update(text).digest("hex"), expectedHash,
      `The original August 31 ${id} clause is preserved`);
  }
  for (const date of ["2026-08-22", "2026-08-23", "2026-08-28"]) {
    assert.ok(html.includes(`href="/privacy/archive/${date}"`));
  }
});

test("preserves the September 5 privacy policy before virtual recruitment", async () => {
  const response = await render("/privacy/archive/2026-09-05?utm_source=history");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertPageMetadata(html, "/privacy/archive/2026-09-05");
  assert.equal(metaContent(html, "robots"), "index, follow");
  assert.match(html, /개인정보처리방침 2026년 9월 5일 보관본/);
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /적용 기간 2026년 9월 5일/);
  assert.match(visibleText(policySection(html, "change-notice")), /방문·성능 통계 안내 정정/);
  assert.match(visibleText(policySection(html, "hosting")), /Cloudflare Web Analytics를 사용합니다/);
  assert.doesNotMatch(html, /id="recruitment-notice"|최종 선정 후 30일 이내/);
});

test("required public images are present", async () => {
  const assets = [
    "../public/ersiyan-social-card.jpg",
    "../public/ersiyan-virtual-gen0-social-card.png",
    "../public/ersiyan-mark.svg",
    "../public/images/brand/ersiyan-logo.png",
    "../public/images/brand/ersiyan-logo-hero.webp",
    "../public/images/mine-logic/feature.png",
    "../public/images/mine-logic/feature-480.webp",
    "../public/images/mine-logic/feature-768.webp",
    "../public/images/mine-logic/feature-1024.webp",
    "../public/images/mine-logic/icon.png",
    "../public/images/mine-logic/icon-96.webp",
    "../public/images/mine-logic/icon-144.webp",
    "../public/images/mine-logic/icon-192.webp",
    "../public/images/mine-logic/02_hint.png",
    "../public/images/mine-logic/02_hint-360.webp",
    "../public/images/mine-logic/02_hint-540.webp",
    "../public/images/mine-logic/02_hint-720.webp",
    "../public/images/mine-logic/03_training.png",
    "../public/images/mine-logic/03_training-360.webp",
    "../public/images/mine-logic/03_training-540.webp",
    "../public/images/mine-logic/03_training-720.webp",
    "../public/images/mine-logic/06_lobby.png",
    "../public/images/mine-logic/06_lobby-360.webp",
    "../public/images/mine-logic/06_lobby-540.webp",
    "../public/images/mine-logic/06_lobby-720.webp",
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
    "../public/images/velsien-summit/secret/nika-oren.webp",
    "../public/images/velsien-summit/secret/luena-havel.webp",
    "../public/images/velsien-summit/secret/serin-noer.webp",
    "../public/images/velsien-summit/secret/pia-morel.webp",
    "../public/images/velsien-summit/secret/kael-droen.webp",
    "../public/images/velsien-summit/secret/battle-shaped-charge.webp",
    "../public/images/velsien-summit/secret/battle-prism-orbits.webp",
    "../public/images/velsien-summit/secret/battle-percussion-rings.webp",
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
    companyHistory,
    responsivePicture,
    mineLogicPage,
    velsienPage,
    velsienSignalDeck,
    velsienStyles,
    studioAccordion,
    businessProfile,
    footer,
    globalStyles,
    robots,
    sitemap,
    llms,
    teaserPreparation,
    responsivePreparation,
  ] = await Promise.all([
    readFile(new URL("../app/_components/HomeContent.tsx", import.meta.url), "utf8"),
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
    readFile(new URL("../app/_components/CompanyHistory.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/ResponsivePicture.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/mine-logic/page.tsx", import.meta.url), "utf8"),
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
    readFile(new URL("../app/_components/ErFooter.tsx", import.meta.url), "utf8"),
    Promise.all(["globals.css", "home.css"].map((file) =>
      readFile(new URL(`../app/${file}`, import.meta.url), "utf8"))).then((styles) => styles.join("\n")),
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8"),
    readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
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
  assert.match(mineLogicPrivacyContent, /document\.documentElement\.lang = policyLocale\[language\]/);
  assert.match(mineLogicPrivacyContent, /document\.documentElement\.lang = "ko-KR"/);
  assert.doesNotMatch(mineLogicPrivacyContent, /document\.documentElement\.lang="en-US"/);
  assert.match(mineLogicPrivacyContent, /aria-pressed=\{language === "ko"\}/);
  assert.match(mineLogicPrivacyContent, /aria-pressed=\{language === "en"\}/);
  assert.match(mineLogicPrivacyContent, /lang="ko-KR" hidden=\{language !== "ko"\}/);
  assert.match(mineLogicPrivacyContent, /lang="en-US" hidden=\{language !== "en"\}/);
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
  const policyButtonHeight = globalStyles.match(/\.policy-language-switcher button\s*\{[^}]*?min-height:\s*(\d+)px/);
  assert.ok(Number(policyButtonHeight?.[1]) >= 44, "Policy language buttons retain a usable touch target");
  assert.match(globalStyles, /\.hero-proof:focus-visible\s*\{[^}]*?outline:\s*3px solid var\(--red\)/);
  assert.match(globalStyles, /outline:\s*3px solid var\(--red-dark\)/);
  assert.match(globalStyles, /\.privacy-footer-links[\s\S]*?gap:\s*12px 22px/);
  assert.match(archivedPrivacy, /OpenAI Sites/);
  assert.match(gameShowcase, /role="tab"/);
  assert.match(gameShowcase, /ArrowRight/);
  assert.match(gameShowcase, /href="\/mine-logic"/);
  assert.match(gameShowcase, /feature-480\.webp/);
  assert.match(gameShowcase, /06_lobby-360\.webp/);
  assert.match(companyHistory, /<details id="company-history"/);
    assert.match(companyHistory, /data-history-milestone=\{event\.id\}/);
  assert.match(companyHistory, /dialogRef\.current\.showModal\(\)/);
  assert.match(companyHistory, /<dialog/);
  assert.match(companyHistory, /event\.target === dialog/);
  assert.match(companyHistory, /dialog\.addEventListener\("click", handleBackdropClick\)/);
  assert.match(companyHistory, /onCancel=\{\(event\) =>/);
  assert.match(companyHistory, /history-dialog--closing/);
  assert.match(companyHistory, /HISTORY_DIALOG_CLOSE_MS = 180/);
  assert.match(companyHistory, /image: "\/ersiyan-social-card\.jpg"[\s\S]*?imageFit: "contain"[\s\S]*?imageSurface: "dark"/);
  assert.match(companyHistory, /image: "\/images\/velsien-summit\/velsien-summit-social\.jpg"/);
  assert.doesNotMatch(
    companyHistory,
    /id: "game-producer-registration"[\s\S]*?image: "\/images\/mine-logic\/icon\.png"/,
  );
  assert.match(globalStyles, /@keyframes history-dialog-out/);
  assert.match(globalStyles, /history-dialog-backdrop-out/);
  assert.match(companyHistory, /href: "\/privacy\/archive\/2026-08-22"/);
  assert.match(companyHistory, /href: "\/privacy\/archive\/2026-08-28"/);
  assert.doesNotMatch(
    companyHistory,
    /행정문서|사업자등록증\.pdf|통신판매업 변경 신고증\.pdf|게임제작업자 등록증\.jpg/,
  );
  assert.doesNotMatch(companyHistory, privateDocumentDataPattern);
  assert.match(responsivePicture, /<picture>/);
  assert.match(responsivePicture, /type="image\/webp"/);
  assert.match(mineLogicPage, /\["VideoGame", "MobileApplication"\]/);
  assert.match(mineLogicPage, /canonical: "\/mine-logic"/);
  assert.match(mineLogicPage, /"@type": "Offer"/);
  assert.match(mineLogicPage, /price: 0/);
  assert.doesNotMatch(mineLogicPage, /aggregateRating|review/);
  assert.match(gameShowcase, /href="\/velsien-summit"/);
  assert.match(gameShowcase, /velsienScenes/);
  assert.match(gameShowcase, /worldFiles/);
  assert.match(gameShowcase, /teaser-lobby\.webp/);
  assert.match(gameShowcase, /teaser-character\.webp/);
  assert.match(velsienPage, /canonical:\s*"\/velsien-summit"/);
  assert.match(velsienPage, /devlog-20260905-city-1600\.webp/);
  assert.match(velsienSignalDeck, /teaser-title\.webp/);
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
  assert.match(velsienSignalDeck, /만들고 있는 모바일 캐릭터 수집형 전략 RPG/);
  assert.match(velsienStyles, /100svh/);
  assert.match(velsienStyles, /prefers-reduced-motion:\s*reduce/);
  assert.match(velsienStyles, /min-height:\s*48px/);
  assert.match(velsienStyles, /\.summitNav a[\s\S]*?min-width:\s*44px/);
  assert.doesNotMatch(
    velsienPage + "\n" + velsienSignalDeck,
    /Project8|QA\/Evidence|Client\/Assets|Lesia|Nael/,
  );
  assert.match(robots, /Sitemap:\s*https:\/\/ersiyan\.com\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/ersiyan\.com\/mine-logic/);
  assert.match(sitemap, /https:\/\/ersiyan\.com\/velsien-summit/);
  assert.match(sitemap, /https:\/\/ersiyan\.com\/velsien-summit\/world/);
  for (const pathname of [
    "/velsien-summit/corporate/orysen",
    "/velsien-summit/corporate/virenta",
    "/velsien-summit/corporate/neryx",
  ]) {
    assert.match(sitemap, new RegExp(`https://ersiyan\\.com${pathname.replaceAll("/", "\\/")}`));
  }
  assert.match(llms, /https:\/\/ersiyan\.com\/mine-logic/);
  assert.match(llms, /https:\/\/ersiyan\.com\/velsien-summit\/world/);
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
  assert.match(page, /ErFooter/);
  assert.match(footer, /businessProfile\.phone/);
  assert.match(footer, /businessProfile\.representative/);
  assert.match(businessProfile, /businessName: "에르시안"/);
  assert.match(businessProfile, /representative: "탁진"/);
  assert.doesNotMatch(footer, /박진/);
  assert.doesNotMatch(page, /애플파이가 운영하는 브랜드/);
  assert.doesNotMatch(page, /사업자정보 ?확인|<dt>업태<\/dt>|<dt>종목<\/dt>/);
  assert.doesNotMatch(
    `${page}\n${businessProfile}`,
    privateDocumentDataPattern,
  );
});

test("server-renders each VELSIEN corporate page with route-specific SEO metadata", async () => {
  const corporatePages = [
    {
      pathname: "/velsien-summit/corporate/orysen",
      title: "ORYSEN | 오리센 · 벨시엔 서밋",
      socialTitle: "ORYSEN | 오리센",
      description: "의료·주거·생산·군사 인프라를 갖춘 벨시엔의 초거대기업 오리센. 세 기업이 같은 산업에서 경쟁하는 가운데 안정과 장기 보장을 우선합니다.",
      siteName: "ORYSEN",
      image: "/orysen-logo.png",
      imageAlt: "오리센 공식 로고",
      englishName: "ORYSEN",
      koreanName: "오리센",
    },
    {
      pathname: "/velsien-summit/corporate/virenta",
      title: "VIRENTA | 비렌타 · 벨시엔 서밋",
      socialTitle: "VIRENTA | 비렌타",
      description: "의료·주거·생산·군사 인프라를 갖춘 벨시엔의 초거대기업 비렌타. 세 기업이 같은 산업에서 경쟁하는 가운데 개인화와 삶의 만족을 우선합니다.",
      siteName: "VIRENTA",
      image: "/virenta-logo.png",
      imageAlt: "비렌타 공식 로고",
      englishName: "VIRENTA",
      koreanName: "비렌타",
    },
    {
      pathname: "/velsien-summit/corporate/neryx",
      title: "NERYX | 네릭스 · 벨시엔 서밋",
      socialTitle: "NERYX | 네릭스",
      description: "의료·주거·생산·군사 인프라를 갖춘 벨시엔의 초거대기업 네릭스. 세 기업이 같은 산업에서 경쟁하는 가운데 능력과 성능의 확장을 우선합니다.",
      siteName: "NERYX",
      image: "/neryx-logo.png",
      imageAlt: "네릭스 공식 로고",
      englishName: "NERYX",
      koreanName: "네릭스",
    },
  ];

  for (const page of corporatePages) {
    const response = await render(page.pathname);
    assert.equal(response.status, 200, `${page.pathname} responds successfully`);

    const html = await response.text();
    const metadata = assertPageMetadata(html, page.pathname, { socialTitle: page.socialTitle });
    assert.equal(metadata.title, page.title);
    assert.equal(metadata.description, page.description);
    assert.equal(metaContent(html, "og:site_name"), page.siteName);
    assert.equal(metaContent(html, "og:type"), "website");
    assert.equal(metaContent(html, "og:locale"), "ko_KR");
    assert.equal(metaContent(html, "og:image"), `https://ersiyan.com${page.image}`);
    assert.equal(metaContent(html, "twitter:image"), `https://ersiyan.com${page.image}`);
    assert.equal(metaContent(html, "og:image:alt"), page.imageAlt);
    assert.equal(metaContent(html, "twitter:image:alt"), page.imageAlt);

    const text = visibleText(html);
    assert.ok(text.includes(page.englishName), `${page.pathname} keeps its English company name visible`);
    assert.ok(text.includes(page.koreanName), `${page.pathname} keeps its Korean company name visible`);
    assert.match(html, /href="\/velsien-summit\/world"/, `${page.pathname} links back to the public world overview`);
    assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i);
  }
});

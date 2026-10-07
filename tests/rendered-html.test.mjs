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
const gamesHeroPattern =
  /<h1\b[^>]*class="home-page-title"[^>]*>에르시안 게임부 · 게임 개발과 운영<\/h1>/i;

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

// Visible text captured from the September 22 policy before notices were moved.
// The new archive retains every section; the current policy retains clauses 1–8.
const september22PolicySectionHashes = {
  "forms-notice": "e3bb115d33943bc3d06e570ed43109de8791726e6253ffbface20967642c2873",
  "recruitment-notice": "e0c848d29dfa219ed7af6a964422afd91cf045a6f9800b16ee986fdfed9770e3",
  "change-notice": "f49e43e84abbcfa2a13d3d03f3e5fa79e5670787e921eaf1c5b8af6ec33cde81",
  "business-name-notice": "a8ae70cf00e0efa69c6ffc499b77c3ff42e0af3c88486073c4818db25e9871ae",
  overview: "c28efa1d1ef058bc32d80a8f77b8b1845f40711bfc96cb55286dc9abd37629ad",
  collection: "60afaf5932b287f4c6b705ec9c32369e1bd9610121620370017e085fde5ecefb",
  hosting: "561c815ff97dab128b5ccc607508d9117d18c36b686005fdc0b7918b98de34ab",
  "application-service": "4f075d3923804c7022b9ec5baa9d41f52e1701ecef8b3c58a2e5fa227c2424bd",
  purpose: "fdb9f67f1fbdfe6aaebf81ff93fb68bed41dec977a217b3a5f5093067dc3b1ea",
  cookies: "a47fcfba285d8d51ca860c940893ffe49626cec0cf7522bd4f9898df062583de",
  rights: "40b46ab44c18efb6e3cdea0405d46aa7d1fa7d282a273417ffb7de19eef6252b",
  apps: "7c9de0a9a8282148c94aff3f21e68a63ba14dbddac498b1ecc379cad88531ed1",
  changes: "a585832a6867604bf065bb7e0795511620e38cae5c1d91c020c1967be3d9501b",
};

// MINE LOGIC processing terms before its business-name history was condensed.
// Contact hashes cover the heading and first two paragraphs, excluding history.
const mineLogicPolicySectionHashes = {
  "scope-ko": "e08a7398a28cddb3f7089a3c89aaf239c0b8c18a2af7df38cb2b90f141543fee",
  "local-data-ko": "1c2e71a98796272c685e297441ccb4f78ce22c96ec6a7192e26b24e87e2a574d",
  "result-card-ko": "1772ad5b496063f3195c074efbfa6f75b3623feaa08f8f6242588833bde37608",
  "network-ko": "7b710930b99936fc7c709f15ada67b0242d54116b0539637a3a89b5e912e4618",
  "permissions-ko": "63a8d56813015286b0dd8f8775f95ee88cf2140854692d2b8812843d0eb7321d",
  "deletion-ko": "1d008217078036c96507b0b51bc80d11a6cf2d2b1c1e4b15d44492412f5a2614",
  "children-ko": "1625b528c0318023ae0eebf5cda1f0e4483fb94fcc6a6343675960507558ca11",
  "website-ko": "a463980d66eeeebf01bd1bf8b3c45a25cbd70ff63139cb14ac1a9a4d0a0ec56d",
  "contact-ko": "07af3c84c939e673a08f9442356234439b096136c8ab4ead5f837e3c4269e467",
  "scope-en": "d9a3d73b9217b7ceda06918c68577bb104281ab31f52b8f5a36eec66ccc2b384",
  "local-data-en": "58f7a8d60acd054a64ca8154cbf65e74452bbf37a6435d7cb545dee44422c7b7",
  "result-card-en": "71eaf4612e8b1cdb831ffbec144da117bb2ddd6c9f3f1dcbd570bfb71d1edf1d",
  "network-en": "601a604a17f270e1776f3bf57c4de32625180c8b6cda47aeb984fad8866f4042",
  "permissions-en": "cd957ce08bb84d309a408c0c2ef0696bb7a8717d28332a18306eb7951ecf445f",
  "deletion-en": "34161bcc2a4ae2965cfae6c8cb7b89ce83a6144f15318f5e120e7b79f02784f5",
  "children-en": "84d730723fd6cc9758fb3bd0c381ff46916ee6769983041149551314eb26b2d7",
  "website-en": "e9dbcde65aa2638f13eb788f9ef2a1ca585026812d0edc523728cedf4e915730",
  "contact-en": "b549dd63f0a0e7647cc7a01f25d4183af8193b0286cfdffa0569a3c6ecf36f86",
};

const noticePages = [
  { slug: "virtual-recruitment-pause-2026-09-28", datePublished: "2026-09-28", title: "버츄얼 모집 일시 중단" },
  { slug: "application-form-2026-09-22", datePublished: "2026-09-22", title: "지원서를 좀 더 간단하게 바꿨어요" },
  { slug: "recruitment-privacy-2026-09-19", datePublished: "2026-09-19", title: "지원할때 자료?" },
  { slug: "analytics-correction-2026-09-05", datePublished: "2026-09-05", title: "방문 통계 설명을 바로잡았어요" },
  { slug: "business-name-2026-08-31", datePublished: "2026-08-31", title: "사업자명. 에르시안" },
  { slug: "brand-domain-2026-08-28", datePublished: "2026-08-28", title: "에르시안 출범!" },
  { slug: "mine-logic-update-2026-08-28", datePublished: "2026-08-28", title: "MINE LOGIC 1.3.3, 이렇게 바뀌었어요" },
  { slug: "hosting-change-2026-08-23", datePublished: "2026-08-23", title: "홈페이지 이전" },
];
const noticeRoutes = ["/notices", ...noticePages.map(({ slug }) => `/notices/${slug}`)];

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
  assert.equal(new URL(metaContent(html, "og:url")).href, url);
  const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag))
    .filter(({ rel }) => rel === "canonical");
  assert.deepEqual(canonicals.map(({ href }) => new URL(href).href), [url]);
  assert.equal(metaContent(html, "og:image"), metaContent(html, "twitter:image"));
  assert.ok(metaContent(html, "og:image:alt"));
  assert.ok(metaContent(html, "twitter:image:alt"));
  return { title, description, url, socialTitle: expectedSocialTitle };
}

function assertDivisionLinks(html, current) {
  for (const [division, href] of [["games", "/games"], ["virtual", "/virtual"]]) {
    const links = [...html.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attributes(tag))
      .filter(({ id }) => id === `ersiyan-${division}-tab`);
    assert.equal(links.length, 1);
    assert.equal(links[0].href, href);
    assert.equal(links[0]["aria-current"], division === current ? "page" : undefined);
    assert.equal(links[0].role, undefined, "Business divisions navigate between documents");
  }
  assert.doesNotMatch(html, /<button\b[^>]*id="ersiyan-(?:games|virtual)-tab"/i);
  const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0];
  assert.ok(header, "The division page has a shared header");
  assert.match(header, /<a\b[^>]*href="\/"[^>]*>회사 정보<\/a>/i,
    "The parent-company homepage remains discoverable from both departments");
  assert.match(header, /<a\b[^>]*href="\/notices"[^>]*>공지사항<\/a>/i,
    "Notices remain discoverable beside the shared company navigation");
}

const footerRoutes = [
  "/",
  "/virtual",
  "/games",
  "/mine-logic",
  "/privacy",
  "/privacy/mine-logic",
  "/privacy/archive/2026-08-22",
  "/privacy/archive/2026-08-23",
  "/privacy/archive/2026-08-28",
  "/privacy/archive/2026-08-31",
  "/privacy/archive/2026-09-05",
  "/privacy/archive/2026-09-19",
  "/privacy/archive/2026-09-22",
  "/velsien-summit",
  "/velsien-summit/world",
  "/velsien-summit/secret",
  ...noticeRoutes,
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
  for (const href of ["/", "/notices", "/privacy", "/privacy/mine-logic", "#top"]) {
    assert.match(footer, new RegExp(`href="${href.replace("#", "\\#")}"`, "i"),
      `${pathname} footer keeps ${href}`);
  }
  assert.match(footer, /href="mailto:help@ersiyan\.com"/i);
  if (pathname === "/virtual") {
    assert.match(footer, /aria-label="Google Forms 지원서 \(새 창\)"/);
    assert.match(footer, /href="https:\/\/(?:docs\.google\.com\/forms\/d\/e\/[^/"]+\/viewform(?:\?[^"]*)?|forms\.gle\/[^"]+)"/);
    assert.doesNotMatch(footer, /biz@ersiyan\.com에서 접수/);
  }
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
    games,
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
    archivedPrivacyPolicy20260919,
    staticGames,
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
    staticArchivedPrivacyPolicy20260919,
    staticNotFound,
  ] = await Promise.all([
    readFile(new URL("../dist/server/vinext-prerender.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/vinext-prerender-paths.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/games.html", import.meta.url), "utf8"),
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
    readFile(new URL("../dist/server/prerendered-routes/privacy/archive/2026-09-19.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/games.html", import.meta.url), "utf8"),
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
    readFile(new URL("../dist/client/privacy/archive/2026-09-19.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/404.html", import.meta.url), "utf8"),
  ]);

  const manifest = JSON.parse(manifestSource);
  const paths = JSON.parse(pathsSource);
  const renderedRoutes = new Map(
    manifest.routes.map(({ route, status }) => [route, status]),
  );

  assert.equal(renderedRoutes.get("/"), "rendered");
  assert.equal(renderedRoutes.get("/virtual"), "rendered");
  assert.equal(renderedRoutes.get("/games"), "rendered");
  assert.equal(renderedRoutes.has("/company"), false, "Company information lives at the root canonical URL");
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
  assert.equal(renderedRoutes.get("/privacy/archive/2026-09-19"), "rendered");
  for (const pathname of [...noticeRoutes, "/privacy/archive/2026-09-22", "/"]) {
    assert.equal(renderedRoutes.get(pathname), "rendered", `${pathname} is prerendered`);
    const [prerendered, staged] = await Promise.all([
      readFile(new URL(`../dist/server/prerendered-routes${pathname === "/" ? "/index" : pathname}.html`, import.meta.url), "utf8"),
      readFile(new URL(`../dist/client${pathname === "/" ? "/index" : pathname}.html`, import.meta.url), "utf8"),
    ]);
    assert.equal(staged, prerendered, `${pathname} stages the complete prerendered document`);
    assertPageMetadata(staged, pathname);
    assertCommonFooter(staged, pathname);
    assert.equal(metaContent(staged, "robots"), "index, follow");
    assert.equal(staged.match(/<h1\b/gi)?.length, 1);
    for (const forbiddenPattern of forbiddenErsiyanGameStudioPatterns) {
      assert.doesNotMatch(staged, forbiddenPattern);
    }
  }
  assert.equal([...renderedRoutes.values()].filter((status) => status === "rendered").length, 29,
    "All 28 canonical pages and the 404 page are prerendered");
  assert.deepEqual(
    [...paths.paths].sort(),
    [
      "/",
      "/virtual",
      "/games",
      "/mine-logic",
      "/privacy",
      "/privacy/archive/2026-08-22",
      "/privacy/archive/2026-08-23",
      "/privacy/archive/2026-08-28",
      "/privacy/archive/2026-08-31",
      "/privacy/archive/2026-09-05",
      "/privacy/archive/2026-09-19",
      "/privacy/archive/2026-09-22",
      "/privacy/mine-logic",
      "/velsien-summit",
      "/velsien-summit/corporate/neryx",
      "/velsien-summit/corporate/orysen",
      "/velsien-summit/corporate/virenta",
      "/velsien-summit/secret",
      "/velsien-summit/world",
      ...noticeRoutes,
    ].sort(),
  );
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
  assert.equal(staticGames, games);
  assertPageMetadata(staticGames, "/games");
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
  assert.equal(staticArchivedPrivacyPolicy20260919, archivedPrivacyPolicy20260919);
  assert.match(staticNotFound, /<title>에르시안<\/title>/i);
  for (const publicHtml of [
    staticGames,
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
    staticArchivedPrivacyPolicy20260919,
    staticNotFound,
  ]) {
    for (const forbiddenPattern of forbiddenErsiyanGameStudioPatterns) {
      assert.doesNotMatch(publicHtml, forbiddenPattern);
    }
  }
  assert.match(staticGames, gamesHeroPattern);
  assert.match(staticGames, /게임제작업자 등록번호/);
  assert.match(staticGames, /제2026-000002호/);
  assert.doesNotMatch(staticGames, /\/_next\/image\?/);
  assert.doesNotMatch(staticMineLogic, /\/_next\/image\?/);
  assert.match(
    staticGames,
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
  assert.match(description, /0기 버추얼 크리에이터 모집·활동 안내/);
  assert.match(description, /내부 준비.*신규 모집.*일시 중단/);
  assert.match(description, /모집 재개.*공지/);
  assert.match(description, /치지직.*3D 버튜버/);
  assert.equal(metaContent(html, "og:image"), "https://ersiyan.com/ersiyan-virtual-gen0-social-card.png");
  assert.equal(metaContent(html, "og:image:alt"), "에르시안 버츄얼 0기 크리에이터 모집 안내");
  assertDivisionLinks(html, "virtual");
  assert.equal(html.match(/<h1\b/gi)?.length, 1);
  assert.match(html, /<h1\b[^>]*id="virtual-title"/i);
  assert.doesNotMatch(html, /<h1\b[^>]*class="home-page-title"/i);
  assert.match(html, /<section\b(?=[^>]*id="ersiyan-virtual-view")(?![^>]*\bhidden)[^>]*>/i);
  const virtualStart = html.indexOf('id="ersiyan-virtual-view"');
  const mainEnd = html.indexOf("</main>", virtualStart);
  assert.ok(virtualStart >= 0 && mainEnd > virtualStart, "Virtual has its own division content");
  // Scope these checks to Virtual; the navigation and legal footer remain shared.
  const virtualSection = html.slice(virtualStart, mainEnd);
  const virtualText = visibleText(virtualSection);
  assert.match(virtualText, /에르시안 버츄얼\s*0기/);
  assert.match(virtualText, /지원 접수 일시 중단/);
  assert.doesNotMatch(virtualSection, /id="virtual-pause-notice-title"/,
    "The user removed the duplicated recruitment pause box from the hero");
  assert.doesNotMatch(virtualText, /공지사항에서 보기/);
  assert.equal((virtualText.match(/\(모집 일시중단\)/g) ?? []).length, 2,
    "Both visible application buttons show the requested pause note");
  assert.match(virtualText, /모집 인원\s*1명/);
  assert.match(virtualText, /만 19세 이상/);
  assert.match(virtualText, /CHZZK/);
  assert.match(virtualText, /3D 버츄얼/);
  assert.doesNotMatch(virtualText, /70\s*[/:]\s*30|70\s*크리에이터|수익 배분의 기본 비율/,
    "Detailed commercial terms belong in the application, not the recruitment landing page");
  assert.doesNotMatch(virtualSection, /id="virtual-terms"/);
  assert.doesNotMatch(virtualText, /에르시안을 처음 만났다면|RELEASED GAME|IN DEVELOPMENT|MINE LOGIC|VELSIEN SUMMIT/);
  assert.doesNotMatch(virtualSection, /href="\/(?:mine-logic|velsien-summit)"/i);
  assert.doesNotMatch(virtualText, /모든 장비를 지급합니다|고정급을 지급합니다|월급을 보장|AI(?:로|를 사용하여|를 활용해)\s*(?:3D|캐릭터)/i);
  assert.match(virtualSection, /href="#virtual-apply"/);
  assert.match(virtualText, /모집 문의\s*·\s*biz@ersiyan\.com/);
  const applySection = html.match(/<section\b[^>]*id="virtual-apply"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
  assert.ok(applySection, "Application details are visible in the public route");
  for (const term of ["닉네임", "생년월일", "성별", "이메일", "3~5분", "처음 방송을 켜고 시청자 다섯 명과 이야기한다면", "음성 파일", "Google 로그인"]) {
    assert.ok(visibleText(applySection).includes(term), `Recruitment explains ${term}`);
  }
  assert.match(applySection, /href="\/privacy"/);
  const formLinks = [...applySection.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attributes(tag))
    .filter(({ href }) => /^https:\/\/(?:docs\.google\.com\/forms\/|forms\.gle\/)/.test(href ?? ""));
  assert.equal(formLinks.length, 1, "The application has one external Google Forms response action");
  const formUrl = new URL(formLinks[0].href);
  assert.ok(formUrl.hostname === "forms.gle" || /^\/forms\/d\/e\/[^/]+\/viewform$/.test(formUrl.pathname),
    "The application opens a responder URL, never the private editor");
  assert.equal(formLinks[0].target, "_blank");
  assert.match(formLinks[0].rel, /noopener/);
  const allFormLinks = [...html.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attributes(tag))
    .filter(({ href }) => /^https:\/\/(?:docs\.google\.com\/forms\/|forms\.gle\/)/.test(href ?? ""));
  assert.equal(allFormLinks.length, 3, "Hero, application and footer preserve the live Forms actions");
  for (const link of allFormLinks) {
    assert.equal(link.href, formLinks[0].href);
    assert.equal(link["aria-disabled"], undefined, "The displayed pause does not disable the application link");
    assert.notEqual(link.tabindex, "-1", "Application links remain reachable by keyboard");
  }
  assert.match(applySection, /새 창/);
  assert.match(applySection, /biz@ersiyan\.com/);
  assert.doesNotMatch(applySection, /href="mailto:[^"]*subject=/);
  assert.doesNotMatch(html, /<section\b[^>]*id="ersiyan-games-view"/i);
  assert.doesNotMatch(html, /id="(?:games|studio|game-tab-mine-logic|game-tab-velsien)"/i);
  assert.doesNotMatch(html, /<img\b[^>]*src="\/images\/(?:mine-logic|velsien-summit)\//i);
  assert.doesNotMatch(html, /<link\b(?=[^>]*rel="preload")(?=[^>]*\/(?:mine-logic|velsien-summit)\/)[^>]*>/i);
  assert.doesNotMatch(html, /id="(?:ersiyan-company-view|company-history|site-notices)"/);
  assert.match(html, /id="business-info"/);
  assert.match(html, /에르시안 사업자 정보/);
  assert.doesNotMatch(html, /href="\/velsien-summit\/secret"/i);
});

test("both division documents identify the same parent and equal departments", async () => {
  for (const pathname of ["/games", "/virtual"]) {
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
    assert.deepEqual(departments.map(({ url }) => url), ["https://ersiyan.com/games", "https://ersiyan.com/virtual"]);
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
    assert.equal(page.about["@id"], departments[pathname === "/games" ? 0 : 1]["@id"]);
  }
});

test("server-renders the searchable but unlisted VELSIEN secret archive", async () => {
  const [response, gamesResponse, velsienResponse] =
    await Promise.all([
      render("/velsien-summit/secret"),
      render("/"),
      render("/velsien-summit"),
    ]);
  assert.equal(response.status, 200);

  const [html, games, velsien] = await Promise.all([
    response.text(),
    gamesResponse.text(),
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

  for (const publicPage of [games, velsien]) {
    assert.doesNotMatch(
      publicPage,
      /href="\/velsien-summit\/secret"/i,
    );
  }
});

test("server-renders Games with equal division links and legal footer", async () => {
  const response = await render("/games");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(
    html,
    /<title>에르시안 게임부 · 게임 개발과 운영 \| ERSIYAN GAMES<\/title>/i,
  );
  assert.match(html, gamesHeroPattern);
  assertDivisionLinks(html, "games");
  assert.doesNotMatch(html, /href="#ersiyan-company-view"/i);
  assert.doesNotMatch(html, /<section\b[^>]*id="ersiyan-virtual-view"/i);
  const gamesStart = html.search(/<section\b[^>]*id="ersiyan-games-view"/i);
  const mainEnd = html.indexOf("</main>", gamesStart);
  assert.ok(gamesStart >= 0 && mainEnd > gamesStart);
  assert.doesNotMatch(html.slice(gamesStart, mainEnd), /PROJECT 001/);
  assert.doesNotMatch(html, /id="(?:ersiyan-company-view|company-history|site-notices)"/);
  assert.equal(html.match(/<h1\b/g)?.length, 1);
  assert.doesNotMatch(html, /company-overview|brand-intro|brand-hierarchy|하나의 에르시안/);
  assert.doesNotMatch(html, /role="tablist" aria-label="사업부 선택"/i);
  assert.doesNotMatch(html, /<section\b(?=[^>]*id="ersiyan-(?:games|company)-view")(?=[^>]*\bhidden)[^>]*>/i);
  assert.match(html, /<h2 id="games-intro-title">직접 만든 게임을<br\s*\/?><span>출시하고 운영합니다\.<\/span><\/h2>/i);
  assert.doesNotMatch(html, /Company History|에르시안 연혁|data-history-milestone=/);
  const gamesIntroduction = html.match(/<p\b[^>]*class="hero-description"[^>]*>([\s\S]*?)<\/p>/i)?.[1];
  assert.ok(gamesIntroduction, "Games keeps its visible development and operations introduction");
  assert.equal(
    visibleText(gamesIntroduction),
    "에르시안의 1인 인디 게임 개발·운영 부문입니다. 안드로이드 지뢰찾기 게임 MINE LOGIC(마인로직)을 출시했고, 새 프로젝트 VELSIEN SUMMIT을 개발하고 있습니다.",
  );
  assert.match(html, /게임 살펴보기/);
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
  assert.equal(metaContent(html, "og:image"), "https://ersiyan.com/ersiyan-brand-social.jpg");
  assert.equal(metaContent(html, "twitter:image"), "https://ersiyan.com/ersiyan-brand-social.jpg");
  assert.match(html, /type="application\/ld\+json"/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"name":"에르시안"/);
  assert.match(html, /"legalName":"에르시안"/);
  assert.match(html, /"alternateName":"ERSIYAN"/);
  assert.match(html, /"foundingDate":"2026-08-19"/);
  assert.match(
    html,
    /"contentUrl":"https:\/\/ersiyan\.com\/images\/brand\/ersiyan-logo\.png"/,
  );
  assert.match(
    html,
    /name="twitter:image:alt" content="에르시안\(ERSIYAN\) 로고"/i,
  );
  assert.match(html, /ersiyan-logo\.png/);
  assert.match(html, /rel="canonical" href="https:\/\/ersiyan\.com\/games"/i);
  assert.match(html, /property="og:url" content="https:\/\/ersiyan\.com\/games"/i);
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
  assert.equal(page.dateModified, "2026-09-28");
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
  assert.match(html, /href="\/notices\/mine-logic-update-2026-08-28"/,
    "The condensed product update links to its complete notice");
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
  assert.match(html, /홈페이지 자체에는 회원가입 기능이나 지원자 데이터베이스가 없습니다/);
  assert.match(html, /help@ersiyan\.com/);
  assert.match(html, /게임 앱 정책/);
  assert.match(html, /Workers Static Assets/);
  assert.match(html, /최근 변경일 및 시행일 2026년 9월 22일/);
  assert.match(html, /href="\/privacy\/archive\/2026-09-19"/);
  assert.match(html, /href="\/privacy\/archive\/2026-09-05"/);
  assert.match(html, /href="\/privacy\/archive\/2026-09-22"/);
  const page = structuredNodes(html).find((node) => node["@type"] === "WebPage");
  assert.equal(page.datePublished, "2026-08-22");
  assert.equal(page.dateModified, "2026-09-28", "The reorganization records its real edit date");
  for (const id of ["overview", "collection", "hosting", "application-service", "purpose", "cookies", "rights", "apps"]) {
    let section = policySection(html, id);
    if (id === "purpose") {
      const assuranceText = "이전에 이메일로 접수한 지원 자료에도 기존의 심사 목적과 삭제 기준을 유지합니다.";
      const assuranceParagraphs = [...section.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi)]
        .map(([paragraph]) => paragraph).filter((paragraph) => visibleText(paragraph) === assuranceText);
      assert.equal(assuranceParagraphs.length, 1, "The unchanged email assurance moved from the notice into the policy");
      section = section.replace(assuranceParagraphs[0], "");
    }
    const text = visibleText(section);
    assert.equal(createHash("sha256").update(text).digest("hex"), september22PolicySectionHashes[id],
      `Current policy retains the September 22 ${id} processing terms`);
  }
  const changes = policySection(html, "changes");
  assert.match(visibleText(changes), /이 방침이 변경되면 시행 전에 홈페이지에서 변경 내용과 시행일을 안내합니다\. 이 방침의 최초 시행일은 2026년 8월 22일입니다\./);
  for (const [id, slug] of [
    ["forms-notice", "application-form-2026-09-22"],
    ["recruitment-notice", "recruitment-privacy-2026-09-19"],
    ["change-notice", "analytics-correction-2026-09-05"],
    ["business-name-notice", "business-name-2026-08-31"],
  ]) {
    const legacyLink = changes.match(new RegExp(`<li\\b(?=[^>]*id="${id}")[^>]*>([\\s\\S]*?)<\\/li>`, "i"))?.[1];
    assert.ok(legacyLink, `Historical #${id} links still reach a compact notice entry`);
    assert.ok(legacyLink.includes(`href="/notices/${slug}"`));
    assert.ok(visibleText(legacyLink).length < 120, "The policy keeps compact history links");
    assert.doesNotMatch(html, new RegExp(`<section\\b[^>]*id="${id}"`, "i"),
      "Announcement bodies belong on their separate notice routes");
  }
  assert.match(visibleText(policySection(html, "purpose")), /이전에 이메일로 접수한 지원 자료에도 기존의 심사 목적과 삭제 기준을 유지합니다/);
  const collection = visibleText(policySection(html, "collection"));
  for (const term of ["Google 설문지", "닉네임", "생년월일", "성별", "만 19세 이상", "이메일 주소", "방송 가능 시간대", "소속사", "3~5분 음성 파일 1개"]) {
    assert.match(collection, new RegExp(term));
  }
  const applicationService = visibleText(policySection(html, "application-service"));
  for (const term of ["Google LLC", "Google Drive", "로그인이 필요", "담당자만 접근", "회신", "직접 적은 이메일", "전 세계 서버"]) {
    assert.ok(applicationService.includes(term), `Application privacy explains ${term}`);
  }
  const purpose = visibleText(policySection(html, "purpose"));
  for (const term of ["선발 심사에만 사용", "AI 학습이나 홍보 콘텐츠", "최종 선정일로부터", "선정 없이 모집을 취소하거나 종료하면", "지원을 철회", "계약과 정산 절차"]) {
    assert.match(purpose, new RegExp(term));
  }
  assert.match(purpose, /Drive의 원본 파일/);
  assert.match(purpose, /휴지통/);
  assert.match(html, /href="mailto:biz@ersiyan\.com"/);
  assert.match(html, /개인사업자 에르시안\(대표자 탁진,[\s\S]*206-43-62580\)/);
  assert.match(html, /\/privacy\/archive\/2026-08-28/);
  assert.match(html, /href="\/privacy\/archive\/2026-08-31"/);
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
  assert.equal(structuredNodes(html).find((node) => node["@type"] === "WebPage").dateModified, "2026-09-28");
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
  const businessNoticeLinks = [...html.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attributes(tag))
    .filter(({ href }) => href === "/notices/business-name-2026-08-31");
  assert.equal(businessNoticeLinks.length, 2, "Both language policies link to the business-name history");
  assert.match(visibleText(policySection(html, "contact-ko")), /개인정보 처리 주체/);
  assert.match(visibleText(policySection(html, "contact-en")), /The data controller is the sole proprietor 에르시안 \(ERSIYAN\)/);
  for (const [id, expectedHash] of Object.entries(mineLogicPolicySectionHashes)) {
    let section = policySection(html, id);
    if (id.startsWith("contact-")) {
      section = section.match(/<h2\b[\s\S]*?<\/h2>/i)?.[0]
        + [...section.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi)].slice(0, 2).map(([paragraph]) => paragraph).join("");
    }
    assert.equal(createHash("sha256").update(visibleText(section)).digest("hex"), expectedHash,
      `The MINE LOGIC ${id} processing terms remain unchanged`);
  }
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

test("preserves the September 19 email recruitment privacy policy", async () => {
  const response = await render("/privacy/archive/2026-09-19?utm_source=history");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertPageMetadata(html, "/privacy/archive/2026-09-19");
  assert.equal(metaContent(html, "robots"), "index, follow");
  assert.match(html, /개인정보처리방침 2026년 9월 19일 보관본/);
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /적용 기간 2026년 9월 19일/);
  const collection = visibleText(policySection(html, "collection"));
  assert.match(collection, /biz@ersiyan\.com에 이메일로 지원하는 경우/);
  assert.match(collection, /선택적으로 제공한 Discord 계정/);
  assert.match(collection, /3~5분 음성 파일/);
  assert.doesNotMatch(collection, /Google 설문지|생년월일/);
  assert.match(visibleText(policySection(html, "purpose")), /최종 선정일로부터 30일 이내에 삭제합니다/);
  assert.doesNotMatch(html, /id="forms-notice"|id="application-service"/);
});

test("preserves the complete September 22 policy before notices were reorganized", async () => {
  const response = await render("/privacy/archive/2026-09-22?utm_source=history");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertPageMetadata(html, "/privacy/archive/2026-09-22");
  assert.equal(metaContent(html, "robots"), "index, follow");
  assert.match(html, /개인정보처리방침 2026년 9월 22일 보관본/);
  assert.match(html, /최근 변경일 및 시행일 2026년 9월 22일/);
  const page = structuredNodes(html).find((node) => node["@type"] === "WebPage");
  assert.equal(page.datePublished, "2026-08-22");
  assert.equal(page.dateModified, "2026-09-22", "The archive retains its historical modification date");
  for (const [id, expectedHash] of Object.entries(september22PolicySectionHashes)) {
    assert.equal(createHash("sha256").update(visibleText(policySection(html, id))).digest("hex"), expectedHash,
      `The original September 22 ${id} section is preserved`);
  }
  for (const id of ["forms-notice", "recruitment-notice", "change-notice", "business-name-notice"]) {
    assert.ok(html.includes(`href="#${id}"`), `The archive preserves its original #${id} index link`);
  }
  assert.match(visibleText(policySection(html, "forms-notice")), /이전에 이메일로 접수한 지원 자료에도 기존의 심사 목적과 삭제 기준을 유지합니다/);
  assert.match(visibleText(policySection(html, "application-service")), /Google LLC.*Google Drive/);
});

test("server-renders the notices index with dated links to every public notice", async () => {
  const response = await render("/notices?utm_source=games");
  assert.equal(response.status, 200);
  const html = await response.text();
  const metadata = assertPageMetadata(html, "/notices");
  assert.equal(metadata.title, "공지사항 | 에르시안");
  assert.equal(metaContent(html, "robots"), "index, follow");
  assert.equal(metaContent(html, "og:type"), "website");
  assert.equal(html.match(/<h1\b/gi)?.length, 1);
  assert.match(html, /<a\b(?=[^>]*href="#notice-content")[^>]*>본문으로 바로가기<\/a>/i);
  assert.match(html, /<main\b[^>]*id="notice-content"[^>]*>/i);
  assert.match(html, /<a\b(?=[^>]*href="\/notices")(?=[^>]*aria-current="page")[^>]*>공지사항<\/a>/i);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  assert.ok(main);
  assert.doesNotMatch(visibleText(main), /쉬어|함께\s*살펴/);
  const visibleLinks = [...main.matchAll(/<a\b[^>]*href="(\/notices\/[^"#?]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
  assert.deepEqual(visibleLinks.map(([, href]) => href).sort(), noticeRoutes.slice(1).sort());
  assert.equal(visibleLinks.length, 8, "All eight notices use the same list instead of a separate hero card");
  const rowClasses = visibleLinks.map(([anchor]) => attributes(anchor.match(/<a\b[^>]*>/i)?.[0] ?? "").class);
  assert.equal(new Set(rowClasses).size, 1, "The most recent notice has the same visual row class as every other notice");
  for (const notice of noticePages) {
    const [, , link] = visibleLinks.find(([, href]) => href === `/notices/${notice.slug}`);
    assert.ok(visibleText(link).includes(notice.title), `The index labels ${notice.slug}`);
    const time = attributes(link.match(/<time\b[^>]*>/i)?.[0] ?? "");
    assert.equal(time.datetime, notice.datePublished, `The index dates ${notice.slug}`);
  }
  const dates = visibleLinks.map(([, , link]) => attributes(link.match(/<time\b[^>]*>/i)?.[0] ?? "").datetime);
  assert.deepEqual(dates, [...dates].sort().reverse(), "Notices are in date order");
  const nodes = structuredNodes(html);
  const collection = nodes.find((node) => node["@type"] === "CollectionPage");
  assert.ok(collection, "The notice index exposes a searchable collection");
  assert.equal(collection.url, metadata.url);
  assert.equal(collection.name, metadata.title);
  assert.equal(collection.description, metadata.description);
  assert.equal(collection.datePublished, "2026-09-28");
  assert.equal(collection.dateModified, "2026-10-02");
  assert.equal(collection.publisher["@id"], "https://ersiyan.com/#organization");
  assert.equal(collection.publisher["@type"], "Organization");
  assert.equal(collection.publisher.name, "에르시안");
  assert.equal(collection.publisher.url, "https://ersiyan.com/");
  assert.equal(collection.mainEntity["@type"], "ItemList");
  assert.deepEqual(collection.mainEntity.itemListElement.map(({ url }) => new URL(url).pathname).sort(),
    noticeRoutes.slice(1).sort());
  assert.deepEqual(collection.mainEntity.itemListElement.map(({ position }) => position), [1, 2, 3, 4, 5, 6, 7, 8]);
  for (const item of collection.mainEntity.itemListElement) {
    const notice = noticePages.find(({ slug }) => `/notices/${slug}` === new URL(item.url).pathname);
    assert.equal(item.name, notice.title);
  }
  const breadcrumb = collection.breadcrumb ?? nodes.find((node) => node["@type"] === "BreadcrumbList");
  assert.ok(breadcrumb, "The collection has a breadcrumb");
  assert.deepEqual(breadcrumb.itemListElement.map(({ item }) => item), ["https://ersiyan.com/", metadata.url]);
});

test("server-renders every notice with original publication dates and substantive history", async () => {
  const noticeContent = {
    "virtual-recruitment-pause-2026-09-28": {
      terms: [/내부 준비.*크리에이터 모집.*일시 중단/, /모집(?: 재개|을 다시 시작).*공지/],
      links: [],
    },
    "application-form-2026-09-22": {
      terms: [/Google 설문지/, /닉네임/, /생년월일/, /성별/, /회신 이메일/, /방송 가능 시간대/, /현재 소속사 여부/, /음성 파일/, /Google 설문지와 Drive/, /이메일.*지원 자료.*심사 목적/, /삭제 기준.*(?:유지|그대로)/],
      links: ["/privacy/archive/2026-09-22", "/privacy/archive/2026-09-19", "/privacy", "/notices/virtual-recruitment-pause-2026-09-28"],
    },
    "recruitment-privacy-2026-09-19": {
      terms: [/이메일.*지원서.*음성 파일/, /선발 기록.*사용 목적.*보관 기간/, /지원 철회 방법/, /일반 문의.*홈페이지 방문 정보.*(?:유지|그대로)/, /2026년 9월 22일.*Google 설문지/],
      links: ["/privacy/archive/2026-09-19", "/privacy/archive/2026-09-05", "/privacy", "/notices/application-form-2026-09-22", "/notices/virtual-recruitment-pause-2026-09-28"],
    },
    "analytics-correction-2026-09-05": {
      terms: [/이미.*Cloudflare Web Analytics.*방문·성능 통계.*(?:정정|바로잡)/, /새로운 분석 도구.*추가.*아니/, /쿠키.*브라우저 저장소.*사용 여부/, /개인정보 처리 사업자.*문의처.*(?:동일|유지|그대로)/],
      links: ["/privacy/archive/2026-09-05", "/privacy/archive/2026-08-31", "/privacy"],
    },
    "business-name-2026-08-31": {
      terms: [/개인사업자명.*애플파이에서 에르시안.*(?:바꿨|변경)/, /대표자.*사업자등록번호.*(?:동일|유지|그대로)/, /개인정보 처리 목적·범위.*문의처.*호스팅 제공자.*(?:동일|유지|그대로)/],
      links: ["/privacy/archive/2026-08-31", "/privacy/archive/2026-08-28", "/privacy"],
    },
    "brand-domain-2026-08-28": {
      terms: [/브랜드명.*에르시안\(ERSIYAN\).*(?:바꿨|변경)/, /applepie\.im에서 ersiyan\.com.*(?:옮겼|이전)/, /당시 사업자명.*애플파이/, /사업자명 변경.*2026년 8월 31일/, /개인정보 처리 사업자.*처리 목적·범위.*문의처.*호스팅 제공자.*(?:동일|유지|그대로)/],
      links: ["/privacy/archive/2026-08-28", "/privacy/archive/2026-08-23", "/privacy", "/notices/business-name-2026-08-31"],
    },
    "mine-logic-update-2026-08-28": {
      terms: [/2026년 8월 28일.*MINE LOGIC v1\.3\.3.*Google Play 스토어.*업데이트/, /ERSIYAN\).*로고.*제작자명.*반영/, /개인정보처리방침 링크.*(?:바꿨|변경)/, /다크 모드.*글자.*(?:가독성.*개선|잘 보이)/],
      links: ["/mine-logic", "https://play.google.com/store/apps/details?id=com.applepie.minelogic"],
    },
    "hosting-change-2026-08-23": {
      terms: [/2026년 8월 23일/, /OpenAI Sites에서 Cloudflare Workers Static Assets/, /공식 도메인.*Cloudflare.*연결.*시점부터 적용/, /화면·기능.*직접 수집.*정보의 범위.*(?:유지|그대로)/, /이메일 문의 자료.*사용 목적.*보관 기간.*(?:동일|유지|그대로)/],
      links: ["/privacy/archive/2026-08-23", "/privacy/archive/2026-08-22", "/privacy"],
    },
  };
  for (const notice of noticePages) {
    const pathname = `/notices/${notice.slug}`;
    const response = await render(`${pathname}?utm_source=history`);
    assert.equal(response.status, 200, `${pathname} responds successfully`);
    const html = await response.text();
    const metadata = assertPageMetadata(html, pathname);
    assert.equal(metadata.title, `${notice.title} | 공지사항 | 에르시안`);
    assert.equal(metaContent(html, "robots"), "index, follow");
    assert.equal(metaContent(html, "og:type"), "article");
    assert.equal(metaContent(html, "article:published_time"), notice.datePublished);
    assert.equal(metaContent(html, "article:modified_time"), "2026-09-29");
    assert.equal(html.match(/<h1\b/gi)?.length, 1);
    const articleHtml = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
    assert.ok(articleHtml, `${pathname} renders an article`);
    const text = visibleText(articleHtml);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
    assert.ok(main, `${pathname} has visible main content`);
    assert.doesNotMatch(visibleText(main), /쉬어|함께\s*살펴/);
    const bodyHtml = articleHtml.match(/<div\b[^>]*class="[^"]*articleBody[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1];
    assert.ok(bodyHtml, `${pathname} has visible article paragraphs`);
    const bodyText = visibleText(bodyHtml);
    assert.ok(text.includes(notice.title));
    assert.equal(attributes(articleHtml.match(/<time\b[^>]*>/i)?.[0] ?? "").datetime, notice.datePublished);
    assert.match(articleHtml, /href="\/notices"/);
    for (const term of noticeContent[notice.slug].terms) {
      assert.match(bodyText, term, `${pathname} preserves ${term}`);
    }
    const links = [...articleHtml.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attributes(tag));
    for (const href of noticeContent[notice.slug].links) {
      assert.ok(links.some((link) => link.href === href), `${pathname} relates to ${href}`);
    }
    assert.doesNotMatch(articleHtml, /aria-label="지난 안내"/,
      `${pathname} omits the historical guidance box`);
    assert.doesNotMatch(text, /게시 당시 기준|게시일 기준의 안내예요|현재 내용은 관련 링크의 최신 공지와 페이지에서 확인할 수 있어요/,
      `${pathname} omits the removed historical guidance text`);
    if (notice.datePublished !== "2026-09-28") {
      const related = articleHtml.match(/<section\b[^>]*aria-labelledby="notice-related-title"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
      assert.ok(related, `${pathname} has related pages`);
      assert.equal(visibleText(related.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? ""), "관련 링크");
      assert.ok(related.match(/<a\b[^>]*href="[^"]+"/i), `${pathname} has no empty related section`);
    } else {
      assert.equal(bodyHtml.match(/<p\b/gi)?.length, 2, "The pause announcement has two brief paragraphs");
      const articleHeader = articleHtml.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i)?.[1];
      assert.ok(articleHeader);
      assert.doesNotMatch(articleHeader, /<p\b/i, "The title does not repeat the recruitment status");
      assert.doesNotMatch(articleHtml, /<a\b[^>]*href="\/virtual"/i,
        "The pause article omits the recruitment related link");
      assert.doesNotMatch(articleHtml, /id="notice-related-title"|aria-labelledby="notice-related-title"/,
        "The pause article omits an empty related section");
    }
    const nodes = structuredNodes(html);
    const article = nodes.find((node) => node["@type"] === "Article" && node.url === metadata.url);
    assert.ok(article, `${pathname} exposes its article metadata`);
    assert.equal(article.headline, notice.title);
    assert.equal(article.description, metadata.description);
    assert.equal(article.datePublished, notice.datePublished, "Migration does not replace the original publication date");
    assert.equal(article.dateModified, "2026-09-29");
    assert.equal(article.mainEntityOfPage, metadata.url);
    assert.equal(article.isPartOf["@id"], "https://ersiyan.com/notices#webpage");
    for (const role of ["author", "publisher"]) {
      assert.equal(article[role]["@id"], "https://ersiyan.com/#organization");
      assert.equal(article[role]["@type"], "Organization");
      assert.equal(article[role].name, "에르시안");
      assert.equal(article[role].url, "https://ersiyan.com/");
    }
    const page = nodes.find((node) => node["@type"] === "WebPage" && node.url === metadata.url);
    const breadcrumb = page?.breadcrumb ?? nodes.find((node) => node["@type"] === "BreadcrumbList");
    assert.ok(breadcrumb, `${pathname} has a breadcrumb`);
    assert.deepEqual(breadcrumb.itemListElement.map(({ item }) => item),
      ["https://ersiyan.com/", "https://ersiyan.com/notices", metadata.url]);
    assert.doesNotMatch(text, /행정문서|사업자등록증\.pdf|추후 작성|Coming soon|TODO/i);
  }
});

test("division pages keep notices separate and preserve navigation and legal information", async () => {
  for (const pathname of ["/games", "/virtual"]) {
    const html = await (await render(pathname)).text();
    assert.doesNotMatch(html, /id="(?:site-notices|ersiyan-company-view|company-history)"/);
    assert.doesNotMatch(html, /href="#ersiyan-company-view"/);
    assert.match(html, /href="\/notices"/);
    assert.match(html, /href="\/"/);
    assert.match(html, /id="business-info"/);
    assert.match(html, /href="\/privacy"/);
    const page = structuredNodes(html).find((node) => node["@type"] === "WebPage");
    assert.equal(page.dateModified, "2026-09-30");
  }
});

test("the first visit opens company information with equal choices for both departments", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertPageMetadata(html, "/");
  assert.match(html, /에르시안/);
  assert.match(html, /회사 정보/);
  assert.match(html, /회사 연혁|회사 이야기|연혁/);
  assert.match(html, /id="business-info"/);
  assert.match(html, /<dt>대표자<\/dt>[\s\S]*?<dd>탁진<\/dd>/);
  assert.match(html, /href="\/notices"/);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  assert.ok(main, "Company information is the main content on first arrival");
  assert.match(main, /id="company-title"/);
  assert.match(main, /id="company-history"/);
  assert.equal(main.match(/<h1\b/gi)?.length, 1);
  assert.doesNotMatch(main, /id="(?:ersiyan-games-view|ersiyan-virtual-view|game-tab-mine-logic|virtual-apply)"/);
  const entryLinks = [...main.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attributes(tag))
    .filter(({ href }) => href === "/games" || href === "/virtual");
  assert.equal(entryLinks.length, 2, "Both department entrances are available in the main content");
  assert.deepEqual(entryLinks.map(({ href }) => href).sort(), ["/games", "/virtual"]);
  assert.ok(entryLinks[0].class, "Department entrances have a shared presentation");
  assert.equal(entryLinks[0].class, entryLinks[1].class, "Neither department is presented as a subordinate choice");
  const nodes = structuredNodes(html);
  const page = nodes.find((node) => node["@type"] === "AboutPage");
  const organization = nodes.find((node) => node["@id"] === "https://ersiyan.com/#organization");
  assert.equal(page?.url, "https://ersiyan.com/");
  assert.equal(page?.dateModified, "2026-09-30");
  assert.equal(organization?.legalName, "에르시안");
  assert.equal(page?.about?.["@id"], organization?.["@id"]);
});

test("required public images are present", async () => {
  const assets = [
    "../public/ersiyan-brand-social.jpg",
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
    mineLogicPrivacyLanguage,
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
      new URL("../app/privacy/mine-logic/MineLogicPrivacyLanguage.tsx", import.meta.url),
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
  assert.doesNotMatch(mineLogicPrivacyContent, /"use client"/);
  assert.match(mineLogicPrivacyLanguage, /"use client"/);
  assert.match(mineLogicPrivacyLanguage, /useState<PolicyLanguage>\("en"\)/);
  assert.match(mineLogicPrivacyLanguage, /document\.documentElement\.lang = policyLocale\[language\]/);
  assert.match(mineLogicPrivacyLanguage, /document\.documentElement\.lang = "ko-KR"/);
  assert.doesNotMatch(mineLogicPrivacyLanguage, /document\.documentElement\.lang="en-US"/);
  assert.match(mineLogicPrivacyLanguage, /aria-pressed=\{language === "ko"\}/);
  assert.match(mineLogicPrivacyLanguage, /aria-pressed=\{language === "en"\}/);
  assert.match(mineLogicPrivacyLanguage, /lang="ko-KR" hidden=\{language !== "ko"\}/);
  assert.match(mineLogicPrivacyLanguage, /lang="en-US" hidden=\{language !== "en"\}/);
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
  assert.match(companyHistory, /href: "\/notices\/brand-domain-2026-08-28"/);
  assert.match(companyHistory, /href: "\/notices\/business-name-2026-08-31"/);
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

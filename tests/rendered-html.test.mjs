import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

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
    privacyPolicy,
    staticHomepage,
    staticPrivacyPolicy,
    staticNotFound,
  ] = await Promise.all([
    readFile(new URL("../dist/server/vinext-prerender.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/vinext-prerender-paths.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/index.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/prerendered-routes/privacy.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/index.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/privacy.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/404.html", import.meta.url), "utf8"),
  ]);

  const manifest = JSON.parse(manifestSource);
  const paths = JSON.parse(pathsSource);
  const renderedRoutes = new Map(
    manifest.routes.map(({ route, status }) => [route, status]),
  );

  assert.equal(renderedRoutes.get("/"), "rendered");
  assert.equal(renderedRoutes.get("/privacy"), "rendered");
  assert.deepEqual(paths.paths, ["/", "/privacy"]);
  assert.match(homepage, /<title>애플파이 게임 스튜디오<\/title>/i);
  assert.match(privacyPolicy, /<title>개인정보처리방침 \| 애플파이 게임 스튜디오<\/title>/i);
  assert.equal(staticHomepage, homepage);
  assert.equal(staticPrivacyPolicy, privacyPolicy);
  assert.match(staticNotFound, /<title>애플파이 게임 스튜디오<\/title>/i);
  assert.doesNotMatch(staticHomepage, /\/_next\/image\?/);
  assert.doesNotMatch(staticPrivacyPolicy, /\/_next\/image\?/);
});

test("server-renders the official studio homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(html, /<title>애플파이 게임 스튜디오<\/title>/i);
  assert.match(html, /작은 규칙에서/);
  assert.match(html, /MINE LOGIC/);
  assert.match(html, /VELSIEN SUMMIT/);
  assert.match(html, /com\.applepie\.minelogic/);
  assert.match(html, /mailto:asoul122@naver\.com/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /사업자 정보 펼쳐보기/);
  assert.match(html, /206-43-62580/);
  assert.match(html, /applepie-social-card\.png/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|Starter Project/);
});

test("server-renders the privacy policy", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>개인정보처리방침 \| 애플파이 게임 스튜디오<\/title>/i);
  assert.match(html, /회원가입과 문의 양식을 제공하지 않으며/);
  assert.match(html, /asoul122@naver\.com/);
  assert.match(html, /게임 앱 정책/);
});

test("required public images are present", async () => {
  const assets = [
    "../public/applepie-social-card.png",
    "../public/images/brand/applepie-logo-original.png",
    "../public/images/mine-logic/feature.png",
    "../public/images/mine-logic/icon.png",
    "../public/images/mine-logic/02_hint.png",
    "../public/images/mine-logic/03_training.png",
    "../public/images/mine-logic/06_lobby.png",
  ];

  await Promise.all(assets.map((asset) => access(new URL(asset, import.meta.url))));
});

test("source contains no starter preview dependency", async () => {
  const [page, layout, gameShowcase, studioAccordion, businessDisclosure] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/GameShowcase.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/StudioAccordion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/BusinessDisclosure.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /SkeletonPreview|codex-preview|Starter Project/);
  assert.match(gameShowcase, /role="tab"/);
  assert.match(gameShowcase, /ArrowRight/);
  assert.match(studioAccordion, /aria-expanded=\{isOpen\}/);
  assert.match(businessDisclosure, /tabIndex=\{isOpen \? 0 : -1\}/);
});

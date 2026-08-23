import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const client = new URL("../dist/client/", import.meta.url);

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), "utf8"));
}

test("Cloudflare deployment is static-assets only", async () => {
  const config = await readJson("wrangler.cloudflare.jsonc");

  assert.equal(config.name, "applepie-im-static");
  assert.equal(config.workers_dev, true);
  assert.equal(config.preview_urls, false);
  assert.equal(config.assets?.directory, "./dist/client");
  assert.equal(config.assets?.not_found_handling, "404-page");
  assert.equal(config.assets?.html_handling, "auto-trailing-slash");
  assert.equal("main" in config, false);
  assert.deepEqual(config.routes, [
    {
      pattern: "applepie.im",
      custom_domain: true,
    },
  ]);
  assert.equal("route" in config, false);
  assert.equal("binding" in config.assets, false);
  assert.equal("run_worker_first" in config.assets, false);
});

test("Cloudflare asset directory contains every public route", async () => {
  await Promise.all(
    ["index.html", "privacy.html", "privacy/archive/2026-08-22.html", "404.html", "_headers"].map((file) =>
      access(new URL(file, client)),
    ),
  );

  const [homepage, privacyPolicy, archivedPrivacyPolicy, notFound] = await Promise.all([
    readFile(new URL("index.html", client), "utf8"),
    readFile(new URL("privacy.html", client), "utf8"),
    readFile(new URL("privacy/archive/2026-08-22.html", client), "utf8"),
    readFile(new URL("404.html", client), "utf8"),
  ]);

  assert.match(homepage, /<html[^>]*lang="ko"/i);
  assert.match(homepage, /<title>애플파이 게임 스튜디오<\/title>/i);
  assert.match(privacyPolicy, /<title>개인정보처리방침 \| 애플파이 게임 스튜디오<\/title>/i);
  assert.match(archivedPrivacyPolicy, /<title>개인정보처리방침 2026년 8월 22일 보관본 \| 애플파이 게임 스튜디오<\/title>/i);
  assert.match(notFound, /<title>애플파이 게임 스튜디오<\/title>/i);

  for (const html of [homepage, privacyPolicy, archivedPrivacyPolicy, notFound]) {
    assert.doesNotMatch(html, /dist\/server|server\/index\.js|\/_worker\.js/i);
  }
});

test("every local image, stylesheet, and script referenced by HTML exists", async () => {
  const pages = await Promise.all(
    ["index.html", "privacy.html", "privacy/archive/2026-08-22.html", "404.html"].map((file) =>
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

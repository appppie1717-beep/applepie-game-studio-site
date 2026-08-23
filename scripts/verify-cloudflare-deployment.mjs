import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

function parseArguments(argv) {
  const options = {
    target: "",
    reference: "https://applepie.im",
    idleSeconds: 65,
    idleRuns: 3,
    limitMs: 1000,
    skipIdle: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--skip-idle") {
      options.skipIdle = true;
      continue;
    }

    const key = argument.replace(/^--/, "");
    const value = argv[index + 1];
    if (!argument.startsWith("--") || value === undefined) {
      throw new Error(`Invalid argument: ${argument}`);
    }
    index += 1;

    if (key === "target" || key === "reference") options[key] = value;
    else if (key === "idle-seconds") options.idleSeconds = Number(value);
    else if (key === "idle-runs") options.idleRuns = Number(value);
    else if (key === "limit-ms") options.limitMs = Number(value);
    else throw new Error(`Unknown option: --${key}`);
  }

  if (!options.target) {
    throw new Error("--target is required");
  }
  for (const key of ["idleSeconds", "idleRuns", "limitMs"]) {
    if (!Number.isFinite(options[key]) || options[key] < 0) {
      throw new Error(`--${key} must be a non-negative number`);
    }
  }
  return options;
}

function baseUrl(value) {
  const url = new URL(value);
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url;
}

async function request(url, expectedStatus) {
  const started = performance.now();
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml,*/*;q=0.8",
      "user-agent": "ApplePie-Cloudflare-Migration-Verifier/1.0",
    },
    redirect: "follow",
  });
  const body = Buffer.from(await response.arrayBuffer());
  const durationMs = performance.now() - started;

  assert.equal(
    response.status,
    expectedStatus,
    `${url} returned ${response.status}, expected ${expectedStatus}`,
  );
  return { body, durationMs, headers: response.headers, response };
}

function decodeEntities(value) {
  const named = new Map([
    ["amp", "&"],
    ["apos", "'"],
    ["gt", ">"],
    ["lt", "<"],
    ["nbsp", " "],
    ["quot", '"'],
  ]);
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    if (code.startsWith("#x")) return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    if (code.startsWith("#")) return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    return named.get(code.toLowerCase()) ?? entity;
  });
}

function extractAttributes(html, tagName, attribute) {
  const tagPattern = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  const attributePattern = new RegExp(`\\b${attribute}=["']([^"']*)["']`, "i");
  return [...html.matchAll(tagPattern)]
    .map(([tag]) => tag.match(attributePattern)?.[1])
    .filter((value) => value !== undefined);
}

function semanticSnapshot(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const visibleText = decodeEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

  return {
    title: decodeEntities(title).replace(/\s+/g, " ").trim(),
    visibleText,
    links: extractAttributes(html, "a", "href"),
    images: extractAttributes(html, "img", "src"),
  };
}

function compareSnapshot(actual, expected, label) {
  assert.deepEqual(actual, expected, `${label} differs from the validated static build`);
}

function sameOriginAssetUrls(html, origin) {
  const values = [
    ...extractAttributes(html, "img", "src"),
    ...extractAttributes(html, "script", "src"),
    ...extractAttributes(html, "link", "href"),
  ];
  const urls = new Set();

  for (const value of values) {
    const url = new URL(value, origin);
    if (url.origin === origin.origin) urls.add(url.href);
  }
  return [...urls];
}

const options = parseArguments(process.argv.slice(2));
const target = baseUrl(options.target);
const reference = baseUrl(options.reference);
const localPages = new Map(
  await Promise.all(
    [
      ["/", new URL("../dist/client/index.html", import.meta.url)],
      ["/privacy", new URL("../dist/client/privacy.html", import.meta.url)],
      [
        "/privacy/archive/2026-08-22",
        new URL("../dist/client/privacy/archive/2026-08-22.html", import.meta.url),
      ],
    ].map(async ([pathname, file]) => [pathname, await readFile(file, "utf8")]),
  ),
);

console.log(`Target: ${target.origin}`);
console.log(`Reference: ${reference.origin}`);

for (const [pathname, localHtml] of localPages) {
  const expected = semanticSnapshot(localHtml);
  const referenceResult = await request(new URL(pathname, reference), 200);
  const targetResult = await request(new URL(pathname, target), 200);
  const referenceHtml = referenceResult.body.toString("utf8");
  const targetHtml = targetResult.body.toString("utf8");

  compareSnapshot(semanticSnapshot(referenceHtml), expected, `Reference ${pathname}`);
  compareSnapshot(semanticSnapshot(targetHtml), expected, `Target ${pathname}`);
  console.log(
    `PASS ${pathname} reference=${referenceResult.durationMs.toFixed(1)}ms target=${targetResult.durationMs.toFixed(1)}ms`,
  );

  for (const assetUrl of sameOriginAssetUrls(targetHtml, target)) {
    const assetResult = await request(assetUrl, 200);
    console.log(`PASS asset ${new URL(assetUrl).pathname} ${assetResult.durationMs.toFixed(1)}ms`);
  }
}

const missingResult = await request(new URL("/__applepie_missing_route__", target), 404);
console.log(`PASS 404 ${missingResult.durationMs.toFixed(1)}ms`);

if (!options.skipIdle) {
  await request(target, 200);
  for (let run = 1; run <= options.idleRuns; run += 1) {
    await new Promise((resolve) => setTimeout(resolve, options.idleSeconds * 1000));
    const result = await request(target, 200);
    const cacheStatus = result.headers.get("cf-cache-status") ?? "n/a";
    console.log(
      `IDLE ${run}/${options.idleRuns} ${result.durationMs.toFixed(1)}ms cf-cache-status=${cacheStatus}`,
    );
    assert.ok(
      result.durationMs < options.limitMs,
      `Idle request ${run} took ${result.durationMs.toFixed(1)}ms (limit ${options.limitMs}ms)`,
    );
  }
}

console.log("Cloudflare deployment verification passed.");

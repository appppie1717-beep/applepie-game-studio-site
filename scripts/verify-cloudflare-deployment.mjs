import assert from "node:assert/strict";
import http from "node:http";
import https from "node:https";
import { Resolver } from "node:dns/promises";
import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

function parseArguments(argv) {
  const options = {
    target: "",
    reference: "",
    idleSeconds: 65,
    idleRuns: 3,
    limitMs: 1000,
    skipIdle: false,
    targetOnly: false,
    www: "",
    redirectFrom: [],
    dnsServer: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--skip-idle") {
      options.skipIdle = true;
      continue;
    }
    if (argument === "--target-only") {
      options.targetOnly = true;
      continue;
    }

    const key = argument.replace(/^--/, "");
    const value = argv[index + 1];
    if (!argument.startsWith("--") || value === undefined) {
      throw new Error(`Invalid argument: ${argument}`);
    }
    index += 1;

    if (key === "target" || key === "reference" || key === "www") options[key] = value;
    else if (key === "redirect-from") options.redirectFrom.push(value);
    else if (key === "dns-server") options.dnsServer = value;
    else if (key === "idle-seconds") options.idleSeconds = Number(value);
    else if (key === "idle-runs") options.idleRuns = Number(value);
    else if (key === "limit-ms") options.limitMs = Number(value);
    else throw new Error(`Unknown option: --${key}`);
  }

  if (!options.target) {
    throw new Error("--target is required");
  }
  if (!options.targetOnly && !options.reference) {
    throw new Error("--reference is required unless --target-only is used");
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

const resolver = new Resolver();
const dnsCache = new Map();

async function resolveAddress(hostname) {
  if (!options.dnsServer) return null;
  if (dnsCache.has(hostname)) return dnsCache.get(hostname);
  resolver.setServers([options.dnsServer]);
  const [address] = await resolver.resolve4(hostname);
  assert.ok(address, `No IPv4 address returned for ${hostname}`);
  dnsCache.set(hostname, address);
  return address;
}

function headerValue(headers, name) {
  const value = headers[name.toLowerCase()];
  return Array.isArray(value) ? value.join(", ") : (value ?? null);
}

async function requestOnce(url) {
  assert.match(url.protocol, /^https?:$/, `Unsupported protocol for ${url}`);
  const address = await resolveAddress(url.hostname);
  return new Promise((resolve, reject) => {
    const requestOptions = {
      headers: {
        accept: "text/html,application/xhtml+xml,*/*;q=0.8",
        "user-agent": "ERSIYAN-Cloudflare-Migration-Verifier/1.0",
      },
    };
    if (address) {
      requestOptions.lookup = (_hostname, lookupOptions, callback) => {
        if (typeof lookupOptions === "object" && lookupOptions.all) {
          callback(null, [{ address, family: 4 }]);
        } else {
          callback(null, address, 4);
        }
      };
    }

    const client = url.protocol === "http:" ? http : https;
    const request = client.request(url, requestOptions, (response) => {
      const remoteAddress = response.socket?.remoteAddress ?? "n/a";
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => {
        resolve({
          address: address ?? remoteAddress,
          body: Buffer.concat(chunks),
          headers: response.headers,
          status: response.statusCode,
        });
      });
    });
    request.once("error", reject);
    request.end();
  });
}

async function request(url, expectedStatus, redirect = "follow") {
  const started = performance.now();
  let currentUrl = new URL(url);
  let result;
  let redirectCount = 0;

  for (let redirects = 0; redirects <= 5; redirects += 1) {
    result = await requestOnce(currentUrl);
    const location = headerValue(result.headers, "location");
    const isRedirect = [301, 302, 303, 307, 308].includes(result.status);
    if (redirect !== "follow" || !isRedirect || !location) break;
    assert.ok(redirects < 5, `${url} exceeded the redirect limit`);
    redirectCount += 1;
    currentUrl = new URL(location, currentUrl);
  }

  const durationMs = performance.now() - started;
  assert.equal(
    result.status,
    expectedStatus,
    `${url} via ${result.address} returned ${result.status}, expected ${expectedStatus}; body=${result.body.toString("utf8").slice(0, 80)}`,
  );
  return { ...result, durationMs, finalUrl: currentUrl, redirectCount };
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

function extractCanonicalHref(html) {
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = tag.match(/\brel=["']([^"']*)["']/i)?.[1] ?? "";
    if (!rel.split(/\s+/).some((value) => value.toLowerCase() === "canonical")) continue;
    const href = tag.match(/\bhref=["']([^"']*)["']/i)?.[1] ?? "";
    return decodeEntities(href);
  }
  return "";
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
    canonicalHref: extractCanonicalHref(html),
    htmlLanguage: extractAttributes(html, "html", "lang")[0] ?? "",
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
const reference = options.reference ? baseUrl(options.reference) : null;
const localPages = new Map(
  await Promise.all(
    [
      ["/", new URL("../dist/client/index.html", import.meta.url)],
      [
        "/velsien-summit",
        new URL("../dist/client/velsien-summit.html", import.meta.url),
      ],
      [
        "/velsien-summit/late-update",
        new URL("../dist/client/velsien-summit/late-update.html", import.meta.url),
      ],
      [
        "/velsien-summit/secret",
        new URL("../dist/client/velsien-summit/secret.html", import.meta.url),
      ],
      ["/privacy", new URL("../dist/client/privacy.html", import.meta.url)],
      [
        "/privacy/mine-logic",
        new URL("../dist/client/privacy/mine-logic.html", import.meta.url),
      ],
      [
        "/privacy/archive/2026-08-22",
        new URL("../dist/client/privacy/archive/2026-08-22.html", import.meta.url),
      ],
      [
        "/privacy/archive/2026-08-23",
        new URL("../dist/client/privacy/archive/2026-08-23.html", import.meta.url),
      ],
      [
        "/privacy/archive/2026-08-28",
        new URL("../dist/client/privacy/archive/2026-08-28.html", import.meta.url),
      ],
    ].map(async ([pathname, file]) => [pathname, await readFile(file, "utf8")]),
  ),
);
const targetOnlyPaths = new Set([
  "/privacy/mine-logic",
  "/privacy/archive/2026-08-28",
  "/velsien-summit",
  "/velsien-summit/late-update",
  "/velsien-summit/secret",
]);

console.log(`Target: ${target.origin}`);
console.log(`Reference: ${reference?.origin ?? "target-only"}`);

for (const [pathname, localHtml] of localPages) {
  const expected = semanticSnapshot(localHtml);
  const targetResult = await request(new URL(pathname, target), 200);
  const targetHtml = targetResult.body.toString("utf8");

  let referenceSummary = "target-only";
  if (!options.targetOnly && !targetOnlyPaths.has(pathname) && reference) {
    const referenceResult = await request(new URL(pathname, reference), 200);
    const referenceHtml = referenceResult.body.toString("utf8");
    compareSnapshot(semanticSnapshot(referenceHtml), expected, `Reference ${pathname}`);
    referenceSummary = `${referenceResult.durationMs.toFixed(1)}ms`;
  }
  compareSnapshot(semanticSnapshot(targetHtml), expected, `Target ${pathname}`);
  console.log(
    `PASS ${pathname} reference=${referenceSummary} target=${targetResult.durationMs.toFixed(1)}ms`,
  );

  for (const assetUrl of sameOriginAssetUrls(targetHtml, target)) {
    const assetResult = await request(assetUrl, 200);
    console.log(`PASS asset ${new URL(assetUrl).pathname} ${assetResult.durationMs.toFixed(1)}ms`);
  }
}

const missingResult = await request(new URL("/__ersiyan_missing_route__", target), 404);
console.log(`PASS 404 ${missingResult.durationMs.toFixed(1)}ms`);

const redirectSources = [...new Set([...options.redirectFrom, options.www].filter(Boolean))];
const redirectChecks = [
  { path: "/?utm_source=naver&utm_medium=display", status: 200 },
  { path: "/velsien-summit?utm_source=kakao&utm_medium=link", status: 200 },
  { path: "/privacy?source=old-domain", status: 200 },
  { path: "/privacy/mine-logic?lang=ko&source=old-domain", status: 200 },
  { path: "/privacy/archive/2026-08-22?check=1", status: 200 },
  { path: "/privacy/archive/2026-08-23?check=2", status: 200 },
  { path: "/privacy/archive/2026-08-28?check=3", status: 200 },
  { path: "/__redirect-probe-not-found-20260828?source=migration", status: 404 },
];

for (const redirectSource of redirectSources) {
  for (const redirectCheck of redirectChecks) {
    const sourceUrl = new URL(redirectCheck.path, baseUrl(redirectSource));
    const expectedUrl = new URL(redirectCheck.path, target);
    const response = await request(sourceUrl, 301, "manual");
    const durationMs = response.durationMs;
    const location = headerValue(response.headers, "location");

    assert.ok(location, `${sourceUrl} did not return a Location header`);
    assert.equal(
      new URL(location, sourceUrl).href,
      expectedUrl.href,
      `${sourceUrl} did not preserve the path and query string`,
    );
    const followed = await request(sourceUrl, redirectCheck.status);
    assert.equal(followed.redirectCount, 1, `${sourceUrl} used ${followed.redirectCount} redirects`);
    assert.equal(followed.finalUrl.href, expectedUrl.href, `${sourceUrl} ended at the wrong URL`);
    console.log(
      `PASS redirect 301 ${sourceUrl.href} ${durationMs.toFixed(1)}ms location=${location}`,
    );
  }
}

if (!options.skipIdle) {
  const idleTargets = [
    target,
    new URL("/velsien-summit?utm_source=naver&utm_medium=link", target),
  ];
  for (const idleTarget of idleTargets) await request(idleTarget, 200);
  for (let run = 1; run <= options.idleRuns; run += 1) {
    await new Promise((resolve) => setTimeout(resolve, options.idleSeconds * 1000));
    for (const idleTarget of idleTargets) {
      const result = await request(idleTarget, 200);
      const cacheStatus = headerValue(result.headers, "cf-cache-status") ?? "n/a";
      const openAiCacheStatus = headerValue(result.headers, "x-openai-cache-status");
      console.log(
        `IDLE ${run}/${options.idleRuns} ${idleTarget.pathname} ${result.durationMs.toFixed(1)}ms cf-cache-status=${cacheStatus}`,
      );
      assert.ok(
        result.durationMs < options.limitMs,
        `Idle request ${run} for ${idleTarget.pathname} took ${result.durationMs.toFixed(1)}ms (limit ${options.limitMs}ms)`,
      );
      assert.equal(cacheStatus, "HIT", `${idleTarget.pathname} was not served from Static Assets cache`);
      assert.equal(openAiCacheStatus, null, `${idleTarget.pathname} exposed an OpenAI Sites cache header`);
    }
  }
}

console.log("Cloudflare deployment verification passed.");

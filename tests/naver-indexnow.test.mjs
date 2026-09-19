import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  createPayload, INDEXNOW_ENDPOINT, INDEXNOW_KEY, notifyIndexNow, parseArgs, reserveReceipt,
} from "../scripts/notify-naver-indexnow.mjs";

const sitemapXml = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const urls = ["https://ersiyan.com/", "https://ersiyan.com/virtual"];
const config = { urls, key: INDEXNOW_KEY, sitemapXml };
const keyLocation = `https://ersiyan.com/${INDEXNOW_KEY}.txt`;

function mockResponse(status, body = "", url = "", redirected = false) {
  return { status, url, redirected, text: async () => body };
}

test("public key file matches its root filename and official format", async () => {
  assert.match(INDEXNOW_KEY, /^[a-fA-F0-9-]{8,128}$/);
  assert.equal(await readFile(new URL(`../public/${INDEXNOW_KEY}.txt`, import.meta.url), "utf8"), INDEXNOW_KEY);
  assert.equal(createPayload(config).host, "ersiyan.com");
  assert.equal(createPayload(config).keyLocation, keyLocation);
});

test("default dry run does not fetch even the public key", async () => {
  let calls = 0;
  const receipt = await notifyIndexNow({ ...config, fetchImpl: async () => { calls += 1; throw new Error("No network expected"); } });
  assert.equal(calls, 0);
  assert.equal(receipt.mode, "dry-run");
  assert.equal(receipt.accepted, false);
  assert.equal(receipt.indexed, null);
  assert.match(receipt.payloadSha256, /^[0-9a-f]{64}$/);
  assert.equal(receipt.payloadSha256, (await notifyIndexNow(config)).payloadSha256);
});

test("reject empty, duplicate, foreign, query, fragment, encoded, alias and noncanonical URLs before any request", async () => {
  const invalid = [
    [], [urls[0], urls[0]], ["https://elsewhere.test/"], ["http://ersiyan.com/"],
    ["https://ersiyan.com/virtual?utm_source=test"], ["https://ersiyan.com/virtual#about"],
    ["https://ersiyan.com/virtual.html"], ["https://ersiyan.com/virtual/"],
    ["https://ersiyan.com/%76irtual"], ["https://ersiyan.com"], ["https://ersiyan.com/../virtual"],
    ["https://user:password@ersiyan.com/virtual"], ["https://www.ersiyan.com/"],
  ];
  for (const candidate of invalid) {
    await assert.rejects(notifyIndexNow({ ...config, urls: candidate, submit: true, fetchImpl: () => assert.fail("Validation must precede network") }));
  }
  for (const key of ["", "secret", "invalid/key", "g".repeat(32)]) assert.throws(() => createPayload({ ...config, key }));
  await assert.rejects(notifyIndexNow({ ...config, submit: "false" }), /boolean/);
  assert.throws(() => createPayload({ ...config, sitemapXml: "<urlset/>" }), /Sitemap/);
  assert.throws(() => createPayload({ ...config, sitemapXml: `<loc>${urls[0]}</loc><loc>${urls[0]}</loc>` }), /duplicated/);
});

test("key missing, redirected, foreign or mismatched never reaches POST", async () => {
  for (const response of [
    mockResponse(404), mockResponse(301, INDEXNOW_KEY), mockResponse(200, "wrong-key", keyLocation),
    mockResponse(200, INDEXNOW_KEY, "https://elsewhere.test/key.txt"), mockResponse(200, INDEXNOW_KEY, keyLocation, true),
  ]) {
    let calls = 0;
    const receipt = await notifyIndexNow({ ...config, submit: true, fetchImpl: async (url, options) => {
      calls += 1;
      assert.equal(url, keyLocation);
      assert.equal(options.redirect, "error");
      assert.ok(options.signal instanceof AbortSignal);
      return response;
    } });
    assert.equal(calls, 1);
    assert.equal(receipt.accepted, false);
    assert.equal(receipt.status, "error");
    assert.equal(receipt.errorStage, "key-verification");
  }
});

test("200 delivery and 202 pending verification are distinct; neither asserts indexing", async () => {
  for (const [code, expected] of [[200, "delivered"], [202, "received-key-verification-pending"]]) {
    const calls = [];
    const receipt = await notifyIndexNow({ ...config, submit: true, fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return url === keyLocation ? mockResponse(200, INDEXNOW_KEY, keyLocation) : mockResponse(code, "receipt", INDEXNOW_ENDPOINT);
    } });
    assert.equal(calls.length, 2);
    assert.equal(calls[1].url, "https://searchadvisor.naver.com/indexnow");
    assert.equal(calls[1].options.method, "POST");
    assert.equal(calls[1].options.redirect, "error");
    assert.deepEqual(JSON.parse(calls[1].options.body).urlList, urls);
    assert.equal(receipt.status, expected);
    assert.equal(receipt.httpStatus, code);
    assert.equal(receipt.accepted, true);
    assert.equal(receipt.keyVerified, true);
    assert.equal(receipt.indexed, null);
  }
});

test("API rejection, endpoint redirects and transport failures never become accepted and do not retry", async () => {
  for (const result of [400, 403, 422, 429, 500, "redirect", "transport"]) {
    let calls = 0;
    const receipt = await notifyIndexNow({ ...config, submit: true, fetchImpl: async (url) => {
      calls += 1;
      if (url === keyLocation) return mockResponse(200, INDEXNOW_KEY, keyLocation);
      if (result === "transport") throw new Error("Request timed out");
      if (result === "redirect") return mockResponse(200, "", "https://elsewhere.test/", true);
      return mockResponse(result, "Rejected", INDEXNOW_ENDPOINT);
    } });
    assert.equal(calls, 2);
    assert.equal(receipt.accepted, false);
    assert.equal(receipt.indexed, null);
    assert.ok(["rejected", "error"].includes(receipt.status));
  }
});

test("CLI requires explicit URLs, permits no implicit bulk list and requires a submission receipt", () => {
  assert.deepEqual(parseArgs([]), { urls: [], submit: false, out: null });
  assert.throws(() => createPayload({ ...config, ...parseArgs([]) }), /at least one/);
  assert.throws(() => parseArgs(["--submit", "--url", urls[0]]), /requires --out/);
  assert.throws(() => parseArgs(["--url"]), /Missing value/);
  assert.throws(() => parseArgs(["--endpoint", "https://elsewhere.test/"]), /Unknown option/);
  assert.deepEqual(parseArgs(["--url", urls[0], "--url", urls[1]]).urls, urls);
});

test("receipt reserves a new JSON file inside the workspace and cannot overwrite or escape", async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "ersiyan-indexnow-test-"));
  const workspace = path.join(fixture, "workspace");
  await mkdir(workspace);
  try {
    const handle = await reserveReceipt("receipt.json", workspace);
    await handle.writeFile("{\"reserved\":true}\n", "utf8");
    await handle.close();
    await assert.rejects(reserveReceipt("receipt.json", workspace), /EEXIST/);
    await assert.rejects(reserveReceipt("../outside.json", workspace), /inside the workspace/);
    await assert.rejects(reserveReceipt("receipt.txt", workspace), /end in .json/);
    assert.deepEqual(JSON.parse(await readFile(path.join(workspace, "receipt.json"), "utf8")), { reserved: true });
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

import { createHash } from "node:crypto";
import { open, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SITE_ORIGIN = "https://ersiyan.com";
export const INDEXNOW_ENDPOINT = "https://searchadvisor.naver.com/indexnow";
// This is a public site-ownership token, not an account credential or secret.
export const INDEXNOW_KEY = "665ccfe920a40030c55251b6ee6a7833";
const WORKSPACE_ROOT = fileURLToPath(new URL("../", import.meta.url));

function canonicalUrl(value) {
  const url = new URL(value);
  if (url.origin !== SITE_ORIGIN || url.username || url.password || url.search || url.hash || url.href !== value) {
    throw new Error(`Expected an exact canonical ERSIYAN URL without a query or fragment: ${value}`);
  }
  return value;
}

export function createPayload({ urls, key, sitemapXml }) {
  if (!/^[a-fA-F0-9-]{8,128}$/.test(key)) throw new Error("Invalid public IndexNow key.");
  const allowed = [...sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => canonicalUrl(match[1]));
  if (!allowed.length || new Set(allowed).size !== allowed.length) throw new Error("Sitemap URLs are empty or duplicated.");
  if (!Array.isArray(urls) || !urls.length || urls.length > 10000) throw new Error("Provide at least one changed URL with --url; at most 10000 URLs are allowed.");
  for (const url of urls) {
    canonicalUrl(url);
    if (!allowed.includes(url)) throw new Error(`URL is not in the canonical sitemap: ${url}`);
  }
  if (new Set(urls).size !== urls.length) throw new Error("Duplicate notification URLs are not allowed.");
  return { host: "ersiyan.com", key, keyLocation: `${SITE_ORIGIN}/${key}.txt`, urlList: [...urls] };
}

/** Never performs any HTTP request unless submit is explicitly true. No automatic retries. */
export async function notifyIndexNow({ urls, key, sitemapXml, submit = false, fetchImpl = globalThis.fetch, timeoutMs = 15000 }) {
  const payload = createPayload({ urls, key, sitemapXml });
  if (typeof submit !== "boolean") throw new Error("submit must be an explicit boolean.");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000) throw new Error("Timeout must be an integer between 1 and 60000 ms.");
  const body = JSON.stringify(payload);
  const receipt = {
    timestamp: new Date().toISOString(), endpoint: INDEXNOW_ENDPOINT,
    payloadSha256: createHash("sha256").update(body).digest("hex"),
    urls: payload.urlList, keyLocation: payload.keyLocation,
    mode: submit ? "submit" : "dry-run", status: "dry-run", accepted: false,
    indexed: null, keyVerified: false, httpStatus: null, response: null,
  };
  if (!submit) return receipt;

  let stage = "key-verification";
  try {
    const keyResponse = await fetchImpl(payload.keyLocation, { redirect: "error", signal: AbortSignal.timeout(timeoutMs) });
    if (keyResponse.status !== 200 || keyResponse.redirected || (keyResponse.url && keyResponse.url !== payload.keyLocation)) {
      throw new Error(`Public ownership file must return a direct HTTP 200; received ${keyResponse.status}.`);
    }
    if (await keyResponse.text() !== key) throw new Error("Public ownership file body does not match the configured key.");
    receipt.keyVerified = true;
    stage = "submission";
    const response = await fetchImpl(INDEXNOW_ENDPOINT, {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(timeoutMs),
      headers: { "Content-Type": "application/json; charset=utf-8" }, body,
    });
    receipt.httpStatus = response.status;
    receipt.response = (await response.text()).slice(0, 4000);
    if (response.redirected || (response.url && response.url !== INDEXNOW_ENDPOINT)) throw new Error("IndexNow response came from an unexpected redirect or endpoint.");
    receipt.accepted = response.status === 200 || response.status === 202;
    receipt.status = response.status === 200 ? "delivered" : response.status === 202 ? "received-key-verification-pending" : "rejected";
  } catch (error) {
    receipt.status = "error";
    receipt.errorStage = stage;
    receipt.error = error instanceof Error ? error.message : String(error);
  }
  return receipt;
}

export function parseArgs(args) {
  const options = { urls: [], submit: false, out: null };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--submit") options.submit = true;
    else if (arg === "--url" || arg === "--out") {
      const value = args[++index];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}.`);
      if (arg === "--url") options.urls.push(value);
      else {
        if (options.out) throw new Error("Provide --out only once.");
        options.out = value;
      }
    } else throw new Error(`Unknown option: ${arg}`);
  }
  if (options.submit && !options.out) throw new Error("--submit requires --out with a new workspace JSON receipt path.");
  return options;
}

export async function reserveReceipt(out, workspaceRoot = WORKSPACE_ROOT) {
  const root = await realpath(workspaceRoot);
  const resolved = path.resolve(root, out);
  if (path.extname(resolved) !== ".json") throw new Error("Receipt path must end in .json.");
  // The parent must already exist. Resolve junctions/symlinks before creating anything.
  const parent = await realpath(path.dirname(resolved));
  const relative = path.relative(root, parent);
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error("Receipt must stay inside the workspace.");
  return open(path.join(parent, path.basename(resolved)), "wx");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const sitemapXml = await readFile(path.join(WORKSPACE_ROOT, "public/sitemap.xml"), "utf8");
  const key = await readFile(path.join(WORKSPACE_ROOT, `public/${INDEXNOW_KEY}.txt`), "utf8");
  if (key !== INDEXNOW_KEY) throw new Error("Local ownership file body must exactly match its filename key.");
  createPayload({ ...options, key, sitemapXml });
  // Reserve the receipt before any network operation; never overwrite existing evidence.
  const receiptFile = options.out ? await reserveReceipt(options.out) : null;
  try {
    const receipt = await notifyIndexNow({ ...options, key, sitemapXml });
    const text = `${JSON.stringify(receipt, null, 2)}\n`;
    if (receiptFile) await receiptFile.writeFile(text, "utf8");
    console.log(text.trimEnd());
    if (options.submit && !receipt.accepted) process.exitCode = 1;
  } finally {
    await receiptFile?.close();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}

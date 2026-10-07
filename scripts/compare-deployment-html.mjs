import { createHash } from "node:crypto";

const [leftUrl, rightUrl, ...argumentsAfterUrls] = process.argv.slice(2);
if (!leftUrl || !rightUrl) {
  throw new Error("Usage: node compare-deployment-html.mjs <left-url> <right-url> [--request-timeout-ms <milliseconds>]");
}

let requestTimeoutMs = 15000;
if (argumentsAfterUrls.length > 0) {
  if (argumentsAfterUrls.length !== 2 || argumentsAfterUrls[0] !== "--request-timeout-ms") {
    throw new Error("Only --request-timeout-ms <milliseconds> is supported after the URLs");
  }
  requestTimeoutMs = Number(argumentsAfterUrls[1]);
}
if (!Number.isInteger(requestTimeoutMs) || requestTimeoutMs < 1 || requestTimeoutMs > 2147483647) {
  throw new Error("--request-timeout-ms must be a positive integer no greater than 2147483647");
}

async function readHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort(new Error(`Request timed out after ${requestTimeoutMs}ms: ${url}`));
  }, requestTimeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(`Unexpected status for ${url}: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    if (controller.signal.aborted) throw controller.signal.reason;
    throw new Error(`Request failed for ${url}: ${error.message}`, { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}

const [left, right] = await Promise.all([readHtml(leftUrl), readHtml(rightUrl)]);
const hash = (value) => createHash("sha256").update(value).digest("hex");
let firstDifference = -1;
for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
  if (left[index] !== right[index]) {
    firstDifference = index;
    break;
  }
}
if (firstDifference < 0 && left.length !== right.length) {
  firstDifference = Math.min(left.length, right.length);
}

const context = (value) => {
  const start = Math.max(0, firstDifference - 240);
  const end = firstDifference < 0 ? 500 : firstDifference + 500;
  return value.slice(start, end);
};

console.log(
  JSON.stringify(
    {
      left: { url: leftUrl, length: left.length, sha256: hash(left) },
      right: { url: rightUrl, length: right.length, sha256: hash(right) },
      firstDifference,
      leftContext: context(left),
      rightContext: context(right),
    },
    null,
    2,
  ),
);

import https from "node:https";
import { createHash } from "node:crypto";
import { Resolver } from "node:dns/promises";
import { performance } from "node:perf_hooks";

function parseArguments(argv) {
  const options = { hosts: [], idleSeconds: 0, runs: 1, dnsServer: "", requestTimeoutMs: 15000 };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index]?.replace(/^--/, "");
    const value = argv[index + 1];
    if (!key || value === undefined) throw new Error(`Invalid argument: ${argv[index]}`);
    if (key === "host") options.hosts.push(value);
    else if (key === "dns-server") options.dnsServer = value;
    else if (key === "idle-seconds") options.idleSeconds = Number(value);
    else if (key === "runs") options.runs = Number(value);
    else if (key === "request-timeout-ms") options.requestTimeoutMs = Number(value);
    else throw new Error(`Unknown option: --${key}`);
  }
  if (options.hosts.length === 0) throw new Error("At least one --host is required");
  if (!Number.isFinite(options.idleSeconds) || options.idleSeconds < 0) {
    throw new Error("--idle-seconds must be a non-negative number");
  }
  if (!Number.isInteger(options.runs) || options.runs < 1) {
    throw new Error("--runs must be a positive integer");
  }
  if (!Number.isInteger(options.requestTimeoutMs) || options.requestTimeoutMs < 1 || options.requestTimeoutMs > 2147483647) {
    throw new Error("--request-timeout-ms must be a positive integer no greater than 2147483647");
  }
  return options;
}

function duration(from, to) {
  if (from === undefined || to === undefined) return "n/a";
  return `${(to - from).toFixed(1)}ms`;
}

const resolver = new Resolver();
const addressCache = new Map();

async function resolveAddress(host, dnsServer, signal) {
  if (!dnsServer) return null;
  const hostname = new URL(host).hostname;
  if (addressCache.has(hostname)) return addressCache.get(hostname);
  resolver.setServers([dnsServer]);
  signal.throwIfAborted();
  const cancel = () => resolver.cancel();
  signal.addEventListener("abort", cancel, { once: true });
  try {
    const [address] = await resolver.resolve4(hostname);
    signal.throwIfAborted();
    if (!address) throw new Error(`No IPv4 address returned for ${hostname}`);
    addressCache.set(hostname, address);
    return address;
  } finally {
    signal.removeEventListener("abort", cancel);
  }
}

async function measure(host, dnsServer, requestTimeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort(new Error(`Request timed out after ${requestTimeoutMs}ms: ${host}`));
  }, requestTimeoutMs);
  try {
    const forcedAddress = await resolveAddress(host, dnsServer, controller.signal);
    return await new Promise((resolve, reject) => {
      const started = performance.now();
      const timing = { started };
      let remoteAddress = "n/a";
      let family = "n/a";

      const request = https.request(
        new URL("/", host),
        {
          agent: false,
          signal: controller.signal,
          headers: {
            accept: "text/html,application/xhtml+xml,*/*;q=0.8",
            "user-agent": "ERSIYAN-Cloudflare-Latency-Diagnostic/1.0",
          },
          ...(forcedAddress
            ? {
                lookup: (_hostname, lookupOptions, callback) => {
                  if (typeof lookupOptions === "object" && lookupOptions.all) {
                    callback(null, [{ address: forcedAddress, family: 4 }]);
                  } else {
                    callback(null, forcedAddress, 4);
                  }
                },
              }
            : {}),
        },
        (response) => {
          timing.response = performance.now();
          response.once("error", reject);
          response.once("aborted", () => reject(new Error(`Response aborted: ${host}`)));
          let bytes = 0;
          let preview = "";
          const hash = createHash("sha256");
          response.on("data", (chunk) => {
            bytes += chunk.length;
            hash.update(chunk);
            if (preview.length < 200) preview += chunk.toString("utf8");
          });
          response.on("end", () => {
            timing.end = performance.now();
            resolve({
              host,
              forcedAddress: forcedAddress ?? "n/a",
              status: response.statusCode,
              cache: response.headers["cf-cache-status"] ?? "n/a",
              remoteAddress,
              family,
              bytes,
              preview: preview.slice(0, 200),
              sha256: hash.digest("hex"),
              server: response.headers.server ?? "n/a",
              etag: response.headers.etag ?? "n/a",
              age: response.headers.age ?? "n/a",
              cfRay: response.headers["cf-ray"] ?? "n/a",
              cfWorker: response.headers["x-worker-version"] ?? "n/a",
              openaiCache: response.headers["x-openai-cache-status"] ?? "n/a",
              dns: duration(started, timing.lookup),
              tcp: duration(timing.lookup ?? started, timing.connect),
              tls: duration(timing.connect ?? timing.lookup ?? started, timing.secureConnect),
              ttfb: duration(timing.secureConnect ?? timing.connect ?? timing.lookup ?? started, timing.response),
              download: duration(timing.response, timing.end),
              total: duration(started, timing.end),
            });
          });
        },
      );

      request.on("socket", (socket) => {
        socket.once("lookup", (_error, address, addressFamily) => {
          timing.lookup = performance.now();
          remoteAddress = address;
          family = addressFamily;
        });
        socket.once("connect", () => {
          timing.connect = performance.now();
          remoteAddress = socket.remoteAddress ?? remoteAddress;
          family = socket.remoteFamily ?? family;
        });
        socket.once("secureConnect", () => {
          timing.secureConnect = performance.now();
        });
      });
      request.once("error", reject);
      request.end();
    });
  } catch (error) {
    if (controller.signal.aborted) throw controller.signal.reason;
    throw new Error(`Request failed for ${host}: ${error.message}`, { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}

const options = parseArguments(process.argv.slice(2));

for (let run = 1; run <= options.runs; run += 1) {
  if (options.idleSeconds > 0) {
    await new Promise((resolve) => setTimeout(resolve, options.idleSeconds * 1000));
  }
  for (const host of options.hosts) {
    const result = await measure(host, options.dnsServer, options.requestTimeoutMs);
    console.log(JSON.stringify({ run, ...result }));
  }
}

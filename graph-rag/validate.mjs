import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

const readJsonl = async (path) => {
  const raw = await readFile(path, "utf8");
  return raw.split(/\r?\n/).filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`${path}:${index + 1}: ${error.message}`);
    }
  });
};

const nodes = await readJsonl("graph-rag/nodes.jsonl");
const edges = await readJsonl("graph-rag/edges.jsonl");
const chunks = await readJsonl("graph-rag/chunks.jsonl");
const manifest = JSON.parse(await readFile("graph-rag/manifest.json", "utf8"));
const sitemap = await readFile("public/sitemap.xml", "utf8");
const ids = new Set(nodes.map((node) => node.id));
if (ids.size !== nodes.length) throw new Error("duplicate node id");
const edgeKeys = new Set();
for (const edge of edges) {
  const key = JSON.stringify([edge.from, edge.relation, edge.to]);
  if (edgeKeys.has(key)) {
    throw new Error(`duplicate edge: ${edge.from} -[${edge.relation}]-> ${edge.to}`);
  }
  edgeKeys.add(key);
  if (!ids.has(edge.from) || !ids.has(edge.to)) {
    throw new Error(`edge target missing: ${edge.from} -> ${edge.to}`);
  }
}
const chunkIds = new Set();
for (const chunk of chunks) {
  if (typeof chunk.chunkId !== "string" || !chunk.chunkId.trim()) {
    throw new Error("chunkId must be a nonempty string");
  }
  if (chunkIds.has(chunk.chunkId)) throw new Error(`duplicate chunkId: ${chunk.chunkId}`);
  chunkIds.add(chunk.chunkId);
  for (const nodeId of chunk.nodeIds ?? []) {
    if (!ids.has(nodeId)) throw new Error(`chunk node missing: ${chunk.chunkId} -> ${nodeId}`);
  }
}
const repoRoot = await realpath(process.cwd());
const isOutsideRepo = (target) => {
  const relative = path.relative(repoRoot, target);
  return relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
};
// Asset/evidence nodes can represent a bundle directory as well as a single file.
const fileKinds = new Set(["file", "component", "script", "test", "seo-artifact"]);
const checkedPaths = new Map();
const pathStats = { nodes: 0, uniquePaths: 0, files: 0, directories: 0, externalPathsSkipped: 0 };
for (const node of nodes) {
  if (node.path == null) continue;
  if (typeof node.path !== "string" || !node.path.trim()) {
    throw new Error(`invalid node path: ${node.id}`);
  }
  // External services may document URLs, but validation never fetches or stats them.
  if (/^https?:\/\//i.test(node.path)) {
    pathStats.externalPathsSkipped++;
    continue;
  }
  if (path.isAbsolute(node.path) || path.win32.isAbsolute(node.path)) {
    throw new Error(`node path must be repository-relative: ${node.id} -> ${node.path}`);
  }
  const resolvedPath = path.resolve(repoRoot, node.path);
  if (isOutsideRepo(resolvedPath)) {
    throw new Error(`node path escapes repository: ${node.id} -> ${node.path}`);
  }
  let entry = checkedPaths.get(resolvedPath);
  if (!entry) {
    try {
      const actualPath = await realpath(resolvedPath);
      if (isOutsideRepo(actualPath)) {
        throw new Error(`node path resolves outside repository: ${node.id} -> ${node.path}`);
      }
      // Only inspect path metadata, including private asset-directory references.
      // Never read node contents or enumerate private/browser directories.
      entry = await stat(actualPath);
    } catch (error) {
      if (error.code === "ENOENT" || error.code === "ENOTDIR") {
        throw new Error(`node path missing: ${node.id} (${node.status ?? "unspecified status"}) -> ${node.path}`);
      }
      throw error;
    }
    if (!entry.isFile() && !entry.isDirectory()) {
      throw new Error(`node path must be a file or directory: ${node.id} -> ${node.path}`);
    }
    checkedPaths.set(resolvedPath, entry);
    pathStats[entry.isDirectory() ? "directories" : "files"]++;
  }
  if ((node.kind === "directory" || node.kind === "repo") && !entry.isDirectory()) {
    throw new Error(`node directory path is not a directory: ${node.id} -> ${node.path}`);
  }
  if (fileKinds.has(node.kind) && !entry.isFile()) {
    throw new Error(`node file path is not a file: ${node.id} -> ${node.path}`);
  }
  pathStats.nodes++;
}
pathStats.uniquePaths = checkedPaths.size;
const routes = nodes.filter((node) => node.kind === "route" && node.url);
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (routes.length !== manifest.scope.canonicalRoutes) {
  throw new Error(`manifest expects ${manifest.scope.canonicalRoutes} canonical routes, found ${routes.length}`);
}
if (new Set(sitemapUrls).size !== sitemapUrls.length) throw new Error("duplicate sitemap URL");
const graphUrls = new Set(routes.map((route) => route.url));
if (graphUrls.size !== routes.length) throw new Error("duplicate route URL");
for (const url of sitemapUrls) {
  if (!graphUrls.has(url)) throw new Error(`sitemap URL missing from graph: ${url}`);
}
if (sitemapUrls.length !== routes.length) {
  throw new Error(`graph has ${routes.length} canonical routes but sitemap has ${sitemapUrls.length}`);
}
console.log(JSON.stringify({ nodes: nodes.length, edges: edges.length, chunks: chunks.length, canonicalRoutes: routes.length, pathStats, valid: true }));

import { readFile } from "node:fs/promises";

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
for (const edge of edges) {
  if (!ids.has(edge.from) || !ids.has(edge.to)) {
    throw new Error(`edge target missing: ${edge.from} -> ${edge.to}`);
  }
}
for (const chunk of chunks) {
  for (const nodeId of chunk.nodeIds ?? []) {
    if (!ids.has(nodeId)) throw new Error(`chunk node missing: ${chunk.chunkId} -> ${nodeId}`);
  }
}
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
console.log(JSON.stringify({ nodes: nodes.length, edges: edges.length, chunks: chunks.length, canonicalRoutes: routes.length, valid: true }));

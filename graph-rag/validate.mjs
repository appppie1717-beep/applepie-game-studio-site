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
if (routes.length !== 15) throw new Error(`expected 15 canonical routes, found ${routes.length}`);
console.log(JSON.stringify({ nodes: nodes.length, edges: edges.length, chunks: chunks.length, canonicalRoutes: routes.length, valid: true }));

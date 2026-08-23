import { copyFile, mkdir, readdir } from "node:fs/promises";

const prerenderedRoutes = new URL("../dist/server/prerendered-routes/", import.meta.url);
const staticAssets = new URL("../dist/client/", import.meta.url);

await mkdir(staticAssets, { recursive: true });

async function stageHtml(source, destination) {
  const entries = await readdir(source, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    const sourceEntry = new URL(entry.name, source);
    const destinationEntry = new URL(entry.name, destination);

    if (entry.isDirectory()) {
      await mkdir(destinationEntry, { recursive: true });
      count += await stageHtml(
        new URL(`${entry.name}/`, source),
        new URL(`${entry.name}/`, destination),
      );
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      await copyFile(sourceEntry, destinationEntry);
      count += 1;
    }
  }

  return count;
}

const stagedCount = await stageHtml(prerenderedRoutes, staticAssets);

console.log(`Staged ${stagedCount} prerendered HTML routes as Cloudflare static assets.`);

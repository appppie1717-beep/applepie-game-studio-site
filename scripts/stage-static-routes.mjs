import { copyFile, mkdir } from "node:fs/promises";

const prerenderedRoutes = new URL("../dist/server/prerendered-routes/", import.meta.url);
const staticAssets = new URL("../dist/client/", import.meta.url);

await mkdir(staticAssets, { recursive: true });

await Promise.all(
  ["index.html", "privacy.html", "404.html"].map((filename) =>
    copyFile(new URL(filename, prerenderedRoutes), new URL(filename, staticAssets)),
  ),
);

console.log("Staged 3 prerendered HTML routes as Cloudflare static assets.");

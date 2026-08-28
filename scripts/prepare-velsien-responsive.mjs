import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicDirectory = new URL(
  "../public/images/velsien-summit/",
  import.meta.url,
);
const privateDirectory = new URL(
  "../local-private/velsien-summit/",
  import.meta.url,
);

const sources = [
  {
    id: "teaser-title",
    sourceUrl: new URL("teaser-title.webp", publicDirectory),
    expectedHash: null,
    privateRegions: [],
  },
  {
    id: "teaser-lobby",
    sourceUrl: new URL("teaser-lobby.webp", privateDirectory),
    expectedHash:
      "50cae408a289147d2ccddf9561db70fdc187ab19832e365e96bdc27935df45fc",
    privateRegions: [
      { left: 298, top: 94, width: 174, height: 58 },
      { left: 298, top: 162, width: 330, height: 48 },
      { left: 298, top: 212, width: 586, height: 58 },
      { left: 298, top: 304, width: 538, height: 31 },
      { left: 298, top: 354, width: 330, height: 30 },
      { left: 1190, top: 180, width: 205, height: 92 },
      { left: 1262, top: 22, width: 137, height: 47 },
    ],
  },
  {
    id: "teaser-character",
    sourceUrl: new URL("teaser-character.webp", privateDirectory),
    expectedHash:
      "5fe4f9cb9aa782f0bd7cfa04016f57947362c5f9fc96012a0dff94de322fed85",
    privateRegions: [
      { left: 1390, top: 18, width: 194, height: 40 },
      { left: 838, top: 116, width: 290, height: 58 },
      { left: 838, top: 188, width: 260, height: 31 },
      { left: 838, top: 234, width: 286, height: 36 },
      { left: 992, top: 338, width: 342, height: 52 },
      { left: 992, top: 388, width: 366, height: 102 },
      { left: 816, top: 484, width: 90, height: 36 },
      { left: 954, top: 566, width: 166, height: 37 },
      { left: 1313, top: 558, width: 66, height: 58 },
    ],
  },
];

const variants = [
  { width: 640, quality: 74 },
  { width: 960, quality: 76 },
];

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function makePublicBuffer(source) {
  if (source.privateRegions.length === 0) return source.buffer;

  const blurredRegions = await Promise.all(
    source.privateRegions.map(async (region) => ({
      input: await sharp(source.buffer)
        .extract(region)
        .blur(28)
        .png()
        .toBuffer(),
      left: region.left,
      top: region.top,
    })),
  );

  return sharp(source.buffer)
    .composite(blurredRegions)
    .webp({ quality: 82, effort: 5, smartSubsample: true })
    .toBuffer();
}

for (const source of sources) {
  const sourcePath = fileURLToPath(source.sourceUrl);
  const sourceBuffer = await readFile(sourcePath);
  const sourceHash = sha256(sourceBuffer);

  if (source.expectedHash && sourceHash !== source.expectedHash) {
    throw new Error(`${source.id} 비공개 원본의 지문이 변경되었습니다.`);
  }

  const publicBuffer = await makePublicBuffer({ ...source, buffer: sourceBuffer });
  const publicName = `${source.id}.webp`;
  const publicPath = fileURLToPath(new URL(publicName, publicDirectory));

  if (source.privateRegions.length > 0) {
    await writeFile(publicPath, publicBuffer);
  }

  for (const variant of variants) {
    const output = `${source.id}-${variant.width}.webp`;
    const outputPath = fileURLToPath(new URL(output, publicDirectory));

    await sharp(publicBuffer)
      .resize({ width: variant.width, withoutEnlargement: true })
      .webp({
        quality: variant.quality,
        effort: 5,
        smartSubsample: true,
      })
      .toFile(outputPath);

    const metadata = await sharp(outputPath).metadata();
    const outputStats = await stat(outputPath);

    console.log(
      JSON.stringify({
        output,
        outputBytes: outputStats.size,
        outputWidth: metadata.width,
        outputHeight: metadata.height,
        sourceHash,
      }),
    );
  }

  if (sha256(await readFile(sourcePath)) !== sourceHash) {
    throw new Error(`${source.id} 원본이 변경되었습니다.`);
  }
}

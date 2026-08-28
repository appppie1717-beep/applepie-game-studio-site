import { createHash } from "node:crypto";
import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDirectory = process.argv[2];
const outputDirectory = process.argv[3];

if (!sourceDirectory || !outputDirectory) {
  throw new Error(
    "사용법: node scripts/prepare-velsien-teaser.mjs <원본 폴더> <출력 폴더>",
  );
}

const assets = [
  {
    source: "01_타이틀_게임시작_2400x1080.png",
    output: "teaser-title.webp",
  },
];

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

await mkdir(outputDirectory, { recursive: true });

for (const asset of assets) {
  const sourcePath = path.join(sourceDirectory, asset.source);
  const outputPath = path.join(outputDirectory, asset.output);
  const sourceBuffer = await readFile(sourcePath);
  const sourceHash = sha256(sourceBuffer);
  const sourceMetadata = await sharp(sourceBuffer).metadata();

  await sharp(sourceBuffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5, smartSubsample: true })
    .toFile(outputPath);

  const sourceHashAfter = sha256(await readFile(sourcePath));
  if (sourceHashAfter !== sourceHash) {
    throw new Error(`원본 파일이 변경되었습니다: ${asset.source}`);
  }

  const outputMetadata = await sharp(outputPath).metadata();
  const outputStats = await stat(outputPath);

  console.log(
    JSON.stringify({
      source: asset.source,
      sourceHash,
      sourceWidth: sourceMetadata.width,
      sourceHeight: sourceMetadata.height,
      output: asset.output,
      outputBytes: outputStats.size,
      outputWidth: outputMetadata.width,
      outputHeight: outputMetadata.height,
    }),
  );
}

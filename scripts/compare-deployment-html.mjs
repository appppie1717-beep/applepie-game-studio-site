import { createHash } from "node:crypto";

const [leftUrl, rightUrl] = process.argv.slice(2);
if (!leftUrl || !rightUrl) {
  throw new Error("Usage: node compare-deployment-html.mjs <left-url> <right-url>");
}

const [leftResponse, rightResponse] = await Promise.all([fetch(leftUrl), fetch(rightUrl)]);
if (!leftResponse.ok || !rightResponse.ok) {
  throw new Error(`Unexpected status: ${leftResponse.status}, ${rightResponse.status}`);
}

const [left, right] = await Promise.all([leftResponse.text(), rightResponse.text()]);
const hash = (value) => createHash("sha256").update(value).digest("hex");
let firstDifference = -1;
for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
  if (left[index] !== right[index]) {
    firstDifference = index;
    break;
  }
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

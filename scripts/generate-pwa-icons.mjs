import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const svgPath = path.join(root, "public/icons/icon.svg");
const svg = await readFile(svgPath);

const targets = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  const out = path.join(root, "public/icons", file);
  const png = await sharp(svg).resize(size, size).png().toBuffer();
  await writeFile(out, png);
  const meta = await sharp(png).metadata();
  console.log(`${file}: ${meta.width}x${meta.height} (${png.length} bytes)`);
}

#!/usr/bin/env npx tsx
/**
 * Download exercises from yuhonas/free-exercise-db. Images ship inside that
 * repo (served via jsDelivr's GitHub CDN), which is why this dataset was
 * chosen over hasaneyldrm/exercises-dataset — that one's media host went away.
 * Usage: npx tsx scripts/import-exercises.ts
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const OUT = join(process.cwd(), "src/data/exercises.json");

async function main() {
  console.log("Downloading exercises...");
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const data = await res.json();
  mkdirSync(join(process.cwd(), "src/data"), { recursive: true });
  writeFileSync(OUT, JSON.stringify(data, null, 2));
  console.log(`Saved ${data.length} exercises to ${OUT}`);
}

main().catch(console.error);

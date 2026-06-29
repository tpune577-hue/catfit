#!/usr/bin/env npx tsx
/**
 * Download and normalize exercises from hasaneyldrm/exercises-dataset
 * Usage: npx tsx scripts/import-exercises.ts
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const URL =
  "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json";
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

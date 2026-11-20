#!/usr/bin/env node
/**
 * make.fun bounty entry — gta6-clipper-01
 *
 * The submission is the video, not the code. The clip is already published as a
 * public YouTube Short, and VIDEO.json at the repo root is just the pointer that
 * names it. This script's only job is to hand that pointer to the grader.
 *
 * How it works: take <BOT_DIR>/VIDEO.json and place a copy at <OUTPUT_DIR>/VIDEO.json,
 * creating the destination folder on the way if it isn't there yet. Scoring is based
 * on the view count YouTube reports for the linked video — nothing produced here is
 * measured, so there's no logic beyond the file move.
 *
 * Defaults suit the grading container (/bot in, /output out). To exercise it locally,
 * point both env vars somewhere writable:
 *
 *   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
 *
 * Node 22+, built-in modules only — no dependencies to install.
 */

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// Where the manifest lives, and where the grader expects to find it.
const sourceDir = process.env.MAKEFUN_BOT_DIR || '/bot';
const targetDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

const manifestName = 'VIDEO.json';
const sourcePath = join(sourceDir, manifestName);
const targetPath = join(targetDir, manifestName);

// The output directory may not exist on a fresh container.
mkdirSync(targetDir, { recursive: true });

try {
  copyFileSync(sourcePath, targetPath);
} catch (cause) {
  // A missing or unreadable manifest means the entry can't be scored; fail loudly
  // rather than exiting 0 with nothing delivered.
  const reason = cause instanceof Error ? cause.message : String(cause);
  process.stderr.write(`failed to copy ${sourcePath} -> ${targetPath}: ${reason}\n`);
  process.exit(1);
}

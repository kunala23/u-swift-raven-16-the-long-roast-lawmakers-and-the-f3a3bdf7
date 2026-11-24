// The Long Roast: Lawmakers and the File They Cannot Convert
//
// This program writes a single satirical sentence to entry.txt.
// The sentence is the whole deliverable: one line, judged on bite,
// aim and freshness by a pairwise judge. Everything below exists to
// make sure the line that ships is exactly one sentence, inside the
// 1-320 character gate, and aimed squarely at the brief.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 320;

// The roast, drafted to the judge's brief:
//  - setup: a lawmaker with real authority over AI ("chair of the
//    AI oversight committee");
//  - turn: that authority collapses on the one file she cannot
//    convert, so she performs the whole print-sign-scan ritual
//    herself instead of converting it;
//  - punch: lands on the last words, the circular trip
//    print -> sign -> scan -> email back "as a PDF".
// A specific, lived-in detail (the print-sign-scan loop) instead of
// a generic "old person can't use a computer" cliche.
const ENTRY =
  "The chair of the AI oversight committee still prints the PDF, signs it in ink, scans it, and emails it back \u2014 as a PDF.";

function countSentences(text: string): number {
  // A sentence ends on ., ! or ? followed by space/end. Abbreviations
  // with internal periods would inflate this, so the entry keeps none.
  const trimmed = text.trim();
  const ends = trimmed.match(/[.!?](\s|$)/g);
  return ends === null ? 0 : ends.length;
}

function checkEntry(text: string): string[] {
  const problems: string[] = [];
  if (text.trim().length === 0) {
    problems.push("entry is empty or only whitespace");
  }
  if (text.length > MAX_CHARS) {
    problems.push(`entry is ${text.length} characters, over the ${MAX_CHARS} cap`);
  }
  if (text.includes("\n")) {
    problems.push("entry spans more than one line");
  }
  if (countSentences(text) !== 1) {
    problems.push(`entry has ${countSentences(text)} sentences, must have exactly 1`);
  }
  if (!/lawmaker|chair|senator|committee|congress/i.test(text)) {
    problems.push("entry does not name a lawmaker");
  }
  if (!/\bAI\b|crypto|internet/i.test(text)) {
    problems.push("entry does not name what the lawmaker regulates");
  }
  if (!/PDF/i.test(text)) {
    problems.push("entry does not name the file that cannot be converted");
  }
  if (!/PDF\.$/.test(text.trim())) {
    problems.push("punch does not land on the last words");
  }
  if (/ {2,}/.test(text)) {
    problems.push("entry has a double space");
  }
  return problems;
}

function main(): void {
  const problems = checkEntry(ENTRY);
  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`invalid entry: ${problem}`);
    }
    process.exit(1);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  console.log(`wrote ${outPath} (${ENTRY.length} chars, 1 sentence)`);
  console.log(ENTRY);
}

main();

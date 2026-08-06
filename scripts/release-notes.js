"use strict";

const fs = require("fs");
const path = require("path");

const MAX_NOTES_BYTES = 64 * 1024;
const SECTION_ORDER = [
  "features",
  "improvements",
  "breaking",
  "instructions",
];
const SECTIONS = new Map([
  ["新增 / 重大更新", "features"],
  ["New Features / Major Updates", "features"],
  ["新增", "features"],
  ["New Features", "features"],
  ["修复 / 优化", "improvements"],
  ["Fixes / Improvements", "improvements"],
  ["更改项／修复", "improvements"],
  ["更改项", "improvements"],
  ["修复", "improvements"],
  ["Improvements", "improvements"],
  ["Fixes", "improvements"],
  ["重大变更", "breaking"],
  ["Breaking Changes", "breaking"],
  ["更新方法", "instructions"],
  ["Update Instructions", "instructions"],
]);

class NotesError extends Error {}

function fail(message) {
  throw new NotesError(message);
}

function checkSections(text) {
  const lines = text.split(/\r?\n/);
  const headings = [];
  const locales = [];
  let currentSection = null;
  let currentLocale = null;
  let hasBullet = false;
  let separatorIndex = -1;

  lines.forEach((line, index) => {
    if (line === "## 更新日志") {
      if (locales.length > 0 || currentLocale) {
        fail(`duplicate or misplaced Chinese locale heading on line ${index + 1}`);
      }
      locales.push("zh");
      currentLocale = "zh";
      currentSection = null;
      return;
    }

    if (line === "## Release Notes") {
      if (currentLocale !== "zh" || separatorIndex < 0 || locales.includes("en")) {
        fail(`misplaced English locale heading on line ${index + 1}`);
      }
      locales.push("en");
      currentLocale = "en";
      currentSection = null;
      return;
    }

    if (line === "---") {
      if (currentLocale !== "zh" || separatorIndex >= 0) {
        fail(`invalid locale separator on line ${index + 1}`);
      }
      separatorIndex = index;
      currentSection = null;
      return;
    }

    if (line.startsWith("## ")) {
      fail(`invalid top-level heading on line ${index + 1}`);
    }

    if (line.startsWith("### ")) {
      if (!currentLocale) {
        fail(`section appears before a locale heading on line ${index + 1}`);
      }
      const name = line.slice(4).trim();
      const key = SECTIONS.get(name);
      if (!key) {
        fail(`invalid section on line ${index + 1}: ${name}`);
      }
      if (currentSection && !hasBullet) {
        fail(`section is empty before line ${index + 1}`);
      }
      const localeKey = `${currentLocale}:${key}`;
      if (headings.includes(localeKey)) {
        fail(`section is repeated on line ${index + 1}: ${name}`);
      }
      const previous = headings
        .filter((heading) => heading.startsWith(`${currentLocale}:`))
        .map((heading) => heading.split(":")[1])
        .at(-1);
      if (previous && SECTION_ORDER.indexOf(key) <= SECTION_ORDER.indexOf(previous)) {
        fail(`sections are out of order on line ${index + 1}`);
      }
      headings.push(localeKey);
      currentSection = key;
      hasBullet = false;
      return;
    }

    if (line.startsWith("* ")) {
      if (!currentSection) {
        fail(`bullet appears outside a section on line ${index + 1}`);
      }
      if (line.trim() === "*") {
        fail(`empty bullet on line ${index + 1}`);
      }
      hasBullet = true;
      return;
    }

    if (line.trim() && currentSection) {
      fail(`text must be inside a bullet on line ${index + 1}`);
    }
  });

  if (locales.join(",") !== "zh,en") {
    fail("release notes must contain Chinese and English locale blocks");
  }
  if (separatorIndex < 0) {
    fail("release notes must separate the locale blocks with ---");
  }
  if (currentSection && !hasBullet) {
    fail(`section is empty: ${currentSection}`);
  }
  if (headings.length === 0) {
    fail("release notes contain no change sections");
  }

  const zhSections = new Set(
    headings.filter((heading) => heading.startsWith("zh:")).map((heading) => heading.slice(3))
  );
  const enSections = new Set(
    headings.filter((heading) => heading.startsWith("en:")).map((heading) => heading.slice(3))
  );
  if (zhSections.size !== enSections.size || [...zhSections].some((key) => !enSections.has(key))) {
    fail("Chinese and English sections must be paired");
  }
}

function checkNotes(filePath = "release-notes.md") {
  const notesPath = path.resolve(filePath);
  let details;

  try {
    details = fs.lstatSync(notesPath);
  } catch (error) {
    fail(`release notes are missing or unsafe: ${filePath}`);
  }

  if (!details.isFile() || details.isSymbolicLink() || details.size > MAX_NOTES_BYTES) {
    fail("release notes are unsafe or too large");
  }

  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(
      fs.readFileSync(notesPath)
    );
  } catch (error) {
    fail(`release notes are not valid UTF-8 or cannot be read: ${error.message}`);
  }

  if (!text.trim() || text.includes("\0")) {
    fail("release notes are empty or invalid");
  }

  for (const name of ["RELEASE_LLM_URL", "RELEASE_LLM_KEY", "GH_TOKEN", "GITHUB_TOKEN"]) {
    const value = process.env[name];
    if (value && text.includes(value)) {
      fail("release notes contain a credential");
    }
  }

  checkSections(text);
  return text;
}

if (require.main === module) {
  try {
    checkNotes(process.argv[2] || "release-notes.md");
  } catch (error) {
    const message = error instanceof NotesError ? error.message : String(error);
    console.error(`release notes: ${message}`);
    process.exitCode = 1;
  }
}

module.exports = { checkNotes, NotesError };

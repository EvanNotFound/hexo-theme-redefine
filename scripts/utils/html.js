"use strict";

let placeholderSeed = 0;

const PLACEHOLDER_PREFIX = "redefine_html_slot";

const normalizeNewlines = (value) => String(value ?? "").replace(/\r\n?/g, "\n");

const stripIndent = (value) => {
  const lines = normalizeNewlines(value).split("\n");

  while (lines.length && lines[0].trim() === "") {
    lines.shift();
  }

  while (lines.length && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  let minIndent = Number.POSITIVE_INFINITY;

  lines.forEach((line) => {
    if (line.trim() === "") {
      return;
    }

    const match = line.match(/^[\t ]*/);
    const indent = match ? match[0].length : 0;
    minIndent = Math.min(minIndent, indent);
  });

  if (!Number.isFinite(minIndent) || minIndent <= 0) {
    return lines.join("\n");
  }

  return lines.map((line) => line.slice(minIndent)).join("\n");
};

const stringifyValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(stringifyValue).join("");
  }

  if (value == null) {
    return "";
  }

  return String(value);
};

const compactTagWhitespace = (value, placeholderPrefix) => {
  const placeholderPattern = `${placeholderPrefix}_[0-9]+`;
  const betweenTagAndPlaceholder = new RegExp(`>(?:\\s*)<!--(${placeholderPattern})-->(?:\\s*)<`, "g");

  return value
    .replace(/>[ \t]*\n[ \t]*</g, "><")
    .replace(betweenTagAndPlaceholder, "><!--$1--><");
};

const html = (strings, ...values) => {
  placeholderSeed += 1;
  const placeholderPrefix = `${PLACEHOLDER_PREFIX}_${placeholderSeed}`;

  let template = "";
  for (let index = 0; index < strings.length; index += 1) {
    template += strings[index];
    if (index < values.length) {
      template += `<!--${placeholderPrefix}_${index}-->`;
    }
  }

  const normalizedTemplate = compactTagWhitespace(stripIndent(template), placeholderPrefix);
  const placeholderRegex = new RegExp(`<!--${placeholderPrefix}_(\\d+)-->`, "g");

  return normalizedTemplate.replace(placeholderRegex, (match, index) => {
    const resolved = stringifyValue(values[Number(index)]);
    return resolved == null ? match : resolved;
  });
};

module.exports = {
  html,
};

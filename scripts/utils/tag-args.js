'use strict';

const ARG_KEY_REGEX = /^[A-Za-z_][A-Za-z0-9_-]*$/;

function splitRawArgs(rawArgs) {
  const tokens = [];
  let token = '';
  let quote = '';
  let escaped = false;

  for (const char of String(rawArgs ?? '')) {
    if (quote) {
      if (escaped) {
        token += char;
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = '';
        continue;
      }

      token += char;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (token.length) {
        tokens.push(token);
        token = '';
      }
      continue;
    }

    token += char;
  }

  if (token.length) {
    tokens.push(token);
  }

  return tokens;
}

function parseTagArgs(input) {
  const raw = Array.isArray(input) ? input.join(' ') : String(input ?? '');
  const tokens = splitRawArgs(raw);
  const named = {};
  const positional = [];

  for (const token of tokens) {
    const equalIndex = token.indexOf('=');

    if (equalIndex <= 0) {
      positional.push(token);
      continue;
    }

    const key = token.slice(0, equalIndex).trim();

    if (!ARG_KEY_REGEX.test(key)) {
      positional.push(token);
      continue;
    }

    named[key] = token.slice(equalIndex + 1).trim();
  }

  return {
    raw,
    tokens,
    named,
    positional,
  };
}

function hasNamedArgs(parsed) {
  return Object.keys(parsed?.named || {}).length > 0;
}

function getNamedString(named, key, fallback = '') {
  const value = named?.[key];
  if (typeof value !== 'string' || value.length === 0) {
    return fallback;
  }

  return value;
}

function getNamedNumber(named, key, fallback = 0) {
  const value = named?.[key];
  if (value == null || value === '') {
    return fallback;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function splitClassNames(value) {
  if (value == null || value === '') {
    return [];
  }

  return String(value)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

module.exports = {
  parseTagArgs,
  hasNamedArgs,
  getNamedString,
  getNamedNumber,
  splitClassNames,
};

'use strict';

let placeholderSeed = 0;

function findFenceRanges(text) {
  const ranges = [];
  const lines = text.split('\n');
  let inFence = false;
  let fenceChar = '';
  let fenceLength = 0;
  let fenceStart = 0;
  let offset = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const lineForMatch = line.replace(/\r$/, '');
    const newlineLength = i < lines.length - 1 ? 1 : 0;

    if (!inFence) {
      const match = lineForMatch.match(/^(\s{0,3})(`{3,}|~{3,})(.*)$/);

      if (match) {
        inFence = true;
        fenceChar = match[2][0];
        fenceLength = match[2].length;
        fenceStart = offset;
      }
    } else {
      const closeRegex = new RegExp(`^\\s{0,3}${fenceChar}{${fenceLength},}\\s*$`);

      if (closeRegex.test(lineForMatch)) {
        inFence = false;
        ranges.push({ start: fenceStart, end: offset + line.length + newlineLength });
        fenceChar = '';
        fenceLength = 0;
      }
    }

    offset += line.length + newlineLength;
  }

  if (inFence) {
    ranges.push({ start: fenceStart, end: text.length });
  }

  return ranges;
}

function findFenceRangeAt(index, ranges) {
  for (const range of ranges) {
    if (index >= range.start && index < range.end) {
      return range;
    }
  }

  return null;
}

function extractTagName(tag) {
  const match = tag.match(/^{%\s*([^\s%]+)[\s\S]*%}$/);
  return match ? match[1] : '';
}

function findMatchingEndTag(text, startIndex, tagName, fenceRanges) {
  let index = startIndex;
  let depth = 1;
  const endTagName = `end${tagName}`;

  while (index < text.length) {
    const nextStart = text.indexOf('{%', index);
    if (nextStart === -1) {
      return -1;
    }

    const fenceRange = findFenceRangeAt(nextStart, fenceRanges);
    if (fenceRange) {
      index = fenceRange.end;
      continue;
    }

    const nextEnd = text.indexOf('%}', nextStart + 2);
    if (nextEnd === -1) {
      return -1;
    }

    const rawTag = text.slice(nextStart, nextEnd + 2);
    const name = extractTagName(rawTag);

    if (name === tagName) {
      depth += 1;
    } else if (name === endTagName) {
      depth -= 1;
      if (depth === 0) {
        return nextEnd + 2;
      }
    }

    index = nextEnd + 2;
  }

  return -1;
}

function createPlaceholderPrefix() {
  placeholderSeed += 1;
  return `redefine_swig_${placeholderSeed}`;
}

function escapeTagBlocks(text, placeholderPrefix) {
  const placeholders = [];
  const fenceRanges = findFenceRanges(text);
  let output = '';
  let index = 0;

  while (index < text.length) {
    const nextStart = text.indexOf('{%', index);

    if (nextStart === -1) {
      output += text.slice(index);
      break;
    }

    const fenceRange = findFenceRangeAt(nextStart, fenceRanges);
    if (fenceRange) {
      output += text.slice(index, fenceRange.end);
      index = fenceRange.end;
      continue;
    }

    output += text.slice(index, nextStart);

    const nextEnd = text.indexOf('%}', nextStart + 2);
    if (nextEnd === -1) {
      output += text.slice(nextStart);
      break;
    }

    const rawTag = text.slice(nextStart, nextEnd + 2);
    const tagName = extractTagName(rawTag);
    const placeholder = `<!--${placeholderPrefix}_${placeholders.length}-->`;

    if (!tagName) {
      output += rawTag;
      index = nextEnd + 2;
      continue;
    }

    if (tagName.startsWith('end')) {
      placeholders.push(rawTag);
      output += placeholder;
      index = nextEnd + 2;
      continue;
    }

    const blockEnd = findMatchingEndTag(text, nextEnd + 2, tagName, fenceRanges);
    if (blockEnd !== -1) {
      placeholders.push(text.slice(nextStart, blockEnd));
      output += placeholder;
      index = blockEnd;
      continue;
    }

    placeholders.push(rawTag);
    output += placeholder;
    index = nextEnd + 2;
  }

  return { text: output, placeholders };
}

function restoreTagBlocks(text, placeholders, placeholderPrefix) {
  if (!placeholders.length) {
    return text;
  }

  const placeholderRegex = new RegExp(`<!--${placeholderPrefix}_(\\d+)-->`, 'g');
  return text.replace(placeholderRegex, (match, index) => {
    const stored = placeholders[Number(index)];
    return stored != null ? stored : match;
  });
}

function dedentHtmlLinesOutsideFences(text) {
  const lines = text.split('\n');
  const output = [];
  let inFence = false;
  let fenceChar = '';
  let fenceLength = 0;

  for (const line of lines) {
    const hasCarriageReturn = line.endsWith('\r');
    const normalizedLine = hasCarriageReturn ? line.slice(0, -1) : line;

    if (!inFence) {
      const match = normalizedLine.match(/^(\s{0,3})(`{3,}|~{3,})(.*)$/);

      if (match) {
        inFence = true;
        fenceChar = match[2][0];
        fenceLength = match[2].length;
        output.push(line);
        continue;
      }

      if (/^[\t ]{4,}</.test(normalizedLine)) {
        const dedented = normalizedLine.replace(/^[\t ]+/, '');
        output.push(hasCarriageReturn ? `${dedented}\r` : dedented);
        continue;
      }

      output.push(line);
      continue;
    }

    output.push(line);

    const closeRegex = new RegExp(`^\\s{0,3}${fenceChar}{${fenceLength},}\\s*$`);
    if (closeRegex.test(normalizedLine)) {
      inFence = false;
      fenceChar = '';
      fenceLength = 0;
    }
  }

  return output.join('\n');
}

async function renderMarkdownTagSafe({
  hexo,
  content,
  postContext,
  trim = false,
}) {
  const canRenderMarkdown = typeof hexo?.render?.renderSync === 'function';
  const canRenderTag = typeof hexo?.extend?.tag?.render === 'function';

  if (!canRenderMarkdown || !canRenderTag) {
    throw new ReferenceError('renderMarkdownTagSafe requires a valid hexo instance');
  }

  const placeholderPrefix = createPlaceholderPrefix();
  const { text: escaped, placeholders } = escapeTagBlocks(content, placeholderPrefix);
  const safeContent = dedentHtmlLinesOutsideFences(escaped);
  const renderedMarkdown = hexo.render.renderSync({ text: safeContent, engine: 'markdown' });
  const normalizedMarkdown = trim ? renderedMarkdown.trim() : renderedMarkdown;
  const restored = restoreTagBlocks(normalizedMarkdown, placeholders, placeholderPrefix);
  return hexo.extend.tag.render(restored, postContext);
}

module.exports = {
  findFenceRanges,
  findFenceRangeAt,
  renderMarkdownTagSafe,
};

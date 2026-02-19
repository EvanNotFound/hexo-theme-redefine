/**
 * Module: Tabs
 * hexo-theme-redefine
 * By Evan
 */

'use strict';

const { findFenceRanges, findFenceRangeAt, renderMarkdownTagSafe } = require('../utils/markdown-swig');
const { parseTagArgs, hasNamedArgs, getNamedString, getNamedNumber } = require('../utils/tag-args');

const TAB_START_MARKER_REGEX = /^[\t ]*<!--\s*tab\b([^\r\n]*?)-->\s*$/gm;
const TAB_END_MARKER_REGEX = /^[\t ]*<!--\s*endtab\s*-->\s*$/gm;

const APLAYER_TAG_REGEX = /<div.*class="aplayer aplayer-tag-marker"(.|\n)*<\/script>/g;
const FANCYBOX_TAG_REGEX = /<div.*galleryFlag(.|\n)*<\/span><\/div><\/div>/g;

let stashSeed = 0;
let tabNameSeed = 0;

function normalizeTabToken(value) {
  const normalized = String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '');

  if (!normalized) {
    return 'tab';
  }

  return /^[a-z]/.test(normalized) ? normalized : `tab-${normalized}`;
}

function createAutoTabName(postContext) {
  tabNameSeed += 1;
  const sourcePath = postContext?.page?.path || postContext?.path || postContext?.source || '';
  const base = sourcePath ? normalizeTabToken(sourcePath) : 'tabs';
  return `${base}-${tabNameSeed}`;
}

function parseTabsArgs(args) {
  const rawArgs = args.join(' ').trim();
  const parsedArgs = parseTagArgs(rawArgs);
  const supportsNamed = ['name', 'id', 'active'].some((key) => parsedArgs.named[key] != null);

  if (hasNamedArgs(parsedArgs) && supportsNamed) {
    const namedTabName = getNamedString(parsedArgs.named, 'name', '').trim()
      || getNamedString(parsedArgs.named, 'id', '').trim();
    const positionalTabName = parsedArgs.positional[0] ? parsedArgs.positional[0].trim() : '';
    const tabName = namedTabName || positionalTabName;

    const namedActive = getNamedNumber(parsedArgs.named, 'active', Number.NaN);
    const positionalActive = parsedArgs.positional[1] ? Number(parsedArgs.positional[1]) : Number.NaN;
    const activeTabIndex = Number.isFinite(namedActive)
      ? namedActive
      : Number.isFinite(positionalActive)
        ? positionalActive
        : 0;

    return {
      tabName,
      activeTabIndex,
    };
  }

  if (!rawArgs) {
    return {
      tabName: '',
      activeTabIndex: 0,
    };
  }

  if (!rawArgs.includes('::') && !rawArgs.includes(',')) {
    const activeOnly = Number(rawArgs);
    if (Number.isFinite(activeOnly)) {
      return {
        tabName: '',
        activeTabIndex: activeOnly,
      };
    }
  }

  const delimiter = rawArgs.includes('::') ? '::' : ',';
  const [tabName = '', tabActive = ''] = rawArgs.split(delimiter).map((value) => value.trim());

  return {
    tabName,
    activeTabIndex: Number(tabActive) || 0,
  };
}

function collectMarkerMatches(content, regex, fenceRanges) {
  const markers = [];
  let match;

  regex.lastIndex = 0;

  while ((match = regex.exec(content)) !== null) {
    if (findFenceRangeAt(match.index, fenceRanges)) {
      continue;
    }

    markers.push({
      start: match.index,
      end: match.index + match[0].length,
      headerRaw: (match[1] || '').trim(),
    });
  }

  return markers;
}

function skipOneLineBreak(text, start) {
  if (text.slice(start, start + 2) === '\r\n') {
    return start + 2;
  }

  if (text[start] === '\n' || text[start] === '\r') {
    return start + 1;
  }

  return start;
}

function findSectionEnd(startMarker, nextStartIndex, endMarkers) {
  for (const endMarker of endMarkers) {
    if (endMarker.start <= startMarker.end) {
      continue;
    }

    if (endMarker.start < nextStartIndex) {
      return endMarker.start;
    }

    break;
  }

  return nextStartIndex;
}

function parseTabBlocks(content) {
  const fenceRanges = findFenceRanges(content);
  const startMarkers = collectMarkerMatches(content, TAB_START_MARKER_REGEX, fenceRanges);

  if (!startMarkers.length) {
    return [];
  }

  const endMarkers = collectMarkerMatches(content, TAB_END_MARKER_REGEX, fenceRanges);

  return startMarkers.map((startMarker, index) => {
    const nextStartIndex = startMarkers[index + 1]?.start ?? content.length;
    const bodyStart = skipOneLineBreak(content, startMarker.end);
    const bodyEnd = findSectionEnd(startMarker, nextStartIndex, endMarkers);

    return {
      index: index + 1,
      headerRaw: startMarker.headerRaw,
      body: content.slice(bodyStart, bodyEnd),
    };
  });
}

function parseTabHeader(headerRaw) {
  const parsedHeader = parseTagArgs(headerRaw);
  const supportsNamed = ['title', 'caption', 'icon'].some((key) => parsedHeader.named[key] != null);

  if (hasNamedArgs(parsedHeader) && supportsNamed) {
    return {
      caption: getNamedString(parsedHeader.named, 'title', '').trim()
        || getNamedString(parsedHeader.named, 'caption', '').trim()
        || parsedHeader.positional.join(' ').trim(),
      icon: getNamedString(parsedHeader.named, 'icon', '').trim(),
    };
  }

  const [tabCaption = '', tabIcon = ''] = headerRaw.split('@');

  return {
    caption: tabCaption.trim(),
    icon: tabIcon,
  };
}

function createPlaceholderPrefix(base) {
  stashSeed += 1;
  return `${base}_${stashSeed}`;
}

function stashByPattern(content, pattern, placeholderPrefix) {
  const replacements = [];
  const localPattern = new RegExp(pattern.source, pattern.flags);
  const escapedContent = content.replace(localPattern, (match) => {
    const placeholder = `@@${placeholderPrefix}_${replacements.length}@@`;
    replacements.push(match);
    return placeholder;
  });

  if (!replacements.length) {
    return {
      content,
      restore: (renderedContent) => renderedContent,
    };
  }

  const restoreRegex = new RegExp(`@@${placeholderPrefix}_(\\d+)@@`, 'g');

  return {
    content: escapedContent,
    restore: (renderedContent) => renderedContent.replace(restoreRegex, (placeholder, index) => {
      const replacement = replacements[Number(index)];
      return replacement != null ? replacement : placeholder;
    }),
  };
}

function stashSpecialBlocks(content) {
  const aplayer = stashByPattern(content, APLAYER_TAG_REGEX, createPlaceholderPrefix('redefine_aplayer'));
  const fancybox = stashByPattern(aplayer.content, FANCYBOX_TAG_REGEX, createPlaceholderPrefix('redefine_fancybox'));

  return {
    content: fancybox.content,
    restore: (renderedContent) => aplayer.restore(fancybox.restore(renderedContent)),
  };
}

async function renderTabPaneContent(content, postContext) {
  const { content: stashedContent, restore } = stashSpecialBlocks(content);
  const renderedContent = await renderMarkdownTagSafe({
    hexo,
    content: stashedContent,
    postContext,
    trim: true,
  });
  return restore(renderedContent);
}

async function buildTabNavAndContent(tabBlocks, tabName, activeTabIndex, postContext) {
  const tabNav = [];
  const tabContent = [];
  const hasExplicitActive = activeTabIndex > 0 && activeTabIndex <= tabBlocks.length;
  const resolvedActiveIndex = hasExplicitActive ? activeTabIndex : 1;

  for (const tabBlock of tabBlocks) {
    const { caption, icon } = parseTabHeader(tabBlock.headerRaw);
    const tabHref = normalizeTabToken(`${tabName} ${tabBlock.index}`);
    const finalContent = await renderTabPaneContent(tabBlock.body, postContext);
    const active = tabBlock.index === resolvedActiveIndex;
    const buttonState = active ? 'active' : 'inactive';
    const hiddenAttr = active ? '' : ' hidden';

    tabNav.push(`<button type="button" role="tab" aria-selected="${active}" data-state="${buttonState}" data-tab="${tabHref}" class="inline-flex items-center gap-2 whitespace-nowrap text-third-text-color border-b-2 border-transparent py-2 text-sm font-medium transition-colors hover:text-second-text-color data-[state=active]:border-primary data-[state=active]:text-primary" tabindex="${active ? '0' : '-1'}">${icon + caption}</button>`);
    tabContent.push(`<div class="tab-pane" data-state="${buttonState}" id="${tabHref}"${hiddenAttr}>${finalContent}</div>`);
  }

  return {
    tabNav: tabNav.join(''),
    tabContent: tabContent.join(''),
  };
}

async function postTabs(args, content) {
  const { tabName, activeTabIndex } = parseTabsArgs(args);
  const resolvedTabName = tabName || createAutoTabName(this);

  const tabBlocks = parseTabBlocks(content);
  const { tabNav, tabContent } = await buildTabNavAndContent(tabBlocks, resolvedTabName, activeTabIndex, this);

  const finalTabNav = `<div role="tablist" aria-orientation="horizontal" class="flex gap-3.5 overflow-x-auto px-4 not-markdown scrollbar-hide" tabindex="0">${tabNav}</div>`;
  const finalTabContent = `<div class="tab-content p-4 bg-background-color/70 rounded-md shadow-[0_0_2px_0_var(--shadow-color-1)]">${tabContent}</div>`;
  return `<div class="tabs relative my-4 bg-second-background-color border border-border-color rounded-md" id="tab-${normalizeTabToken(resolvedTabName)}">${finalTabNav + finalTabContent}</div>`;
}

hexo.extend.tag.register('tabs', postTabs, { ends: true, async: true });
hexo.extend.tag.register('subtabs', postTabs, { ends: true, async: true });
hexo.extend.tag.register('subsubtabs', postTabs, { ends: true, async: true });

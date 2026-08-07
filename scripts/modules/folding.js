'use strict';

const {
  parseTagArgs,
  hasNamedArgs,
  getNamedString,
  splitClassNames,
} = require('../utils/tag-args');
const { html } = require('../utils/html');
const { renderMarkdownTagSafe } = require('../utils/markdown-swig');

const FOLDING_VARIANTS = new Set([
  'default', 'yellow', 'blue', 'green', 'red', 'orange', 'pink', 'cyan',
  'white', 'black', 'gray', 'purple',
]);

function normalizeOpenValue(value) {
  const normalized = String(value ?? '').trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return false;
}

function parseNamedArgs(args) {
  const parsedArgs = parseTagArgs(args);
  const supportsNamed = ['title', 'class', 'classes', 'style', 'open']
    .some((key) => parsedArgs.named[key] != null);

  if (!hasNamedArgs(parsedArgs) || !supportsNamed) {
    return null;
  }

  const classNames = [
    ...splitClassNames(getNamedString(parsedArgs.named, 'class', '')),
    ...splitClassNames(getNamedString(parsedArgs.named, 'classes', '')),
    ...splitClassNames(getNamedString(parsedArgs.named, 'style', '')),
  ];

  return {
    title: getNamedString(parsedArgs.named, 'title', '').trim() || parsedArgs.positional.join(' ').trim(),
    className: classNames.join(' ').trim(),
    open: normalizeOpenValue(getNamedString(parsedArgs.named, 'open', '')),
  };
}

function parseLegacyArgs(rawArgs) {
  const delimiter = rawArgs.includes('::') ? '::' : ',';
  const [style = '', title = ''] = rawArgs.split(delimiter).map((arg) => arg.trim());

  return {
    title,
    className: style,
    open: false,
  };
}

async function postFolding(args, content) {
  const rawArgs = args.join(' ').trim();
  const parsed = parseNamedArgs(args) || parseLegacyArgs(rawArgs);

  const renderedContent = await renderMarkdownTagSafe({
    hexo,
    content,
    postContext: this,
  });

  const processedContent = renderedContent.replace(
    /<(h[1-6])>/g,
    (_, tag) => `<p class='${tag}'>`,
  ).replace(
    /<\/(h[1-6])>/g,
    () => '</p>',
  );

  const classNames = splitClassNames(parsed.className);
  const variant = classNames.find((className) => FOLDING_VARIANTS.has(className)) || 'default';
  const customClassAttr = classNames
    .filter((className) => !FOLDING_VARIANTS.has(className))
    .join(' ');
  const openAttr = parsed.open ? ' open' : '';

  return html`
    <details class="folding group relative my-4 rounded-md border border-rd-border bg-second-background-color ${customClassAttr}" data-variant="${variant}"${openAttr} data-header-exclude>
      <summary class="not-markdown flex cursor-pointer items-center rounded-md px-4 py-3"><span>${parsed.title}</span><i class="fa-solid fa-chevron-right ml-auto pt-[3px] transition-transform duration-200 group-open:rotate-90" aria-hidden="true"></i></summary>
      <div class="markdown-body min-w-0 p-4">
        ${processedContent}
      </div>
    </details>
  `;
}

hexo.extend.tag.register('folding', postFolding, { ends: true, async: true });

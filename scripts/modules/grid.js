"use strict";

const {
  parseTagArgs,
  hasNamedArgs,
  getNamedNumber,
  getNamedString,
  splitClassNames,
} = require("../utils/tag-args");
const { html } = require("../utils/html");
const { warnOnce } = require("../deprecations/warn");
const { renderMarkdownTagSafe } = require("../utils/markdown-swig");

const DEFAULT_COLS = 2;
const DEFAULT_GAP = "16px";

const cn = (...groups) =>
  groups
    .flat()
    .filter((value) => value && value.length > 0)
    .join(" ");

const normalizeCols = (value) => {
  const cols = Number(value);

  if (!Number.isFinite(cols)) {
    return DEFAULT_COLS;
  }

  return Math.max(2, Math.floor(cols));
};

const normalizeGap = (value) => {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return DEFAULT_GAP;
  }

  if (/^-?\d+(?:\.\d+)?$/.test(normalized)) {
    return `${normalized}px`;
  }

  if (/^-?\d+(?:\.\d+)?(?:px|rem|em|%|vw|vh|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/i.test(normalized)) {
    return normalized;
  }

  return DEFAULT_GAP;
};

const parseNamedGridArgs = (rawArgs) => {
  const parsedArgs = parseTagArgs(rawArgs);
  const supportsNamed = ["cols", "columns", "gap", "class", "classes"]
    .some((key) => parsedArgs.named[key] != null);

  if (!hasNamedArgs(parsedArgs) || !supportsNamed) {
    return null;
  }

  const positional = [...parsedArgs.positional];
  const namedCols = getNamedNumber(parsedArgs.named, "cols", Number.NaN);
  const namedColumns = getNamedNumber(parsedArgs.named, "columns", Number.NaN);
  const positionalCols = Number(positional[0]);
  const cols = Number.isFinite(namedCols)
    ? namedCols
    : Number.isFinite(namedColumns)
      ? namedColumns
      : Number.isFinite(positionalCols)
        ? positionalCols
        : DEFAULT_COLS;

  const namedGap = getNamedString(parsedArgs.named, "gap", "").trim();
  const positionalGap = positional[1] || "";
  const gap = namedGap || positionalGap;

  const classNames = [
    ...splitClassNames(getNamedString(parsedArgs.named, "class", "")),
    ...splitClassNames(getNamedString(parsedArgs.named, "classes", "")),
  ];

  return {
    cols: normalizeCols(cols),
    gap: normalizeGap(gap),
    classNames,
  };
};

const parsePositionalGridArgs = (args) => {
  const positional = [...args].map((item) => item.trim()).filter(Boolean);

  if (!positional.length) {
    return {
      cols: DEFAULT_COLS,
      gap: DEFAULT_GAP,
      classNames: [],
    };
  }

  let cols = DEFAULT_COLS;
  let gap = DEFAULT_GAP;
  let classNames = positional;

  const maybeCols = Number(positional[0]);
  if (Number.isFinite(maybeCols)) {
    cols = normalizeCols(maybeCols);
    classNames = positional.slice(1);
  }

  if (classNames.length && /^(?:-?\d+(?:\.\d+)?(?:px|rem|em|%|vw|vh|vmin|vmax|ch|ex|cm|mm|in|pt|pc)?)$/i.test(classNames[0])) {
    gap = normalizeGap(classNames[0]);
    classNames = classNames.slice(1);
  }

  return {
    cols,
    gap,
    classNames,
  };
};

const compactGridContent = (content) => content
  .replace(/>[ \t]*\n[ \t]*</g, "><")
  .trim();

const renderGrid = async (parsed, content, postContext) => {
  const renderedContent = await renderMarkdownTagSafe({
    hexo,
    content,
    postContext,
  });

  const className = cn("grid my-4", parsed.classNames);
  const style = `grid-template-columns: repeat(${parsed.cols}, minmax(0, 1fr)); gap: ${parsed.gap};`;

  return html`
    <div class="${className}" style="${style}">
      ${compactGridContent(renderedContent)}
    </div>
  `;
};

const postGrid = async function (args, content) {
  const rawArgs = args.join(" ").trim();
  const parsed = parseNamedGridArgs(rawArgs) || parsePositionalGridArgs(args);
  return renderGrid(parsed, content, this);
};

const parseLegacyButtonsArgs = (args) => {
  const classes = args.join(" ").trim();
  return {
    cols: DEFAULT_COLS,
    gap: DEFAULT_GAP,
    classNames: splitClassNames(classes),
  };
};

const postDeprecatedButtons = async function (args, content) {
  warnOnce({
    hexo,
    id: "tag.deprecation.btns",
    message: "Tag deprecation: `{% btns %}` is deprecated and will be removed in the next major release; use `{% grid cols=2 gap=16 %}` instead.",
  });

  return renderGrid(parseLegacyButtonsArgs(args), content, this);
};

const postDeprecatedButtonsAlias = async function (args, content) {
  warnOnce({
    hexo,
    id: "tag.deprecation.buttons",
    message: "Tag deprecation: `{% buttons %}` is deprecated and will be removed in the next major release; use `{% grid cols=2 gap=16 %}` instead.",
  });

  return renderGrid(parseLegacyButtonsArgs(args), content, this);
};

hexo.extend.tag.register("grid", postGrid, { ends: true, async: true });
hexo.extend.tag.register("btns", postDeprecatedButtons, { ends: true, async: true });
hexo.extend.tag.register("buttons", postDeprecatedButtonsAlias, { ends: true, async: true });

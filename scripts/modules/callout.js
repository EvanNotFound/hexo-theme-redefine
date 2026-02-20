"use strict";

const {
  parseTagArgs,
  hasNamedArgs,
  getNamedString,
  splitClassNames,
} = require("../utils/tag-args");
const { html } = require("../utils/html");
const { warnOnce } = require("../deprecations/warn");

const DEFAULT_TYPE = "default";
const DEFAULT_TITLE = "Note";
const LEGACY_TITLED_DEFAULT_TITLE = "Warning";

const FONT_AWESOME_STYLE_TOKENS = new Set([
  "fa-solid",
  "fa-regular",
  "fa-light",
  "fa-thin",
  "fa-duotone",
  "fa-brands",
  "fa-sharp",
  "fa-sharp-solid",
  "fa-sharp-regular",
  "fa-sharp-light",
  "fa-sharp-thin",
]);

const cn = (...groups) =>
  groups
    .flat()
    .filter((value) => value && value.length > 0)
    .join(" ");

const tokenize = (value) =>
  value
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

const extractIcon = (tokens) => {
  let styleIndex = -1;
  let iconIndex = -1;

  tokens.forEach((token, index) => {
    if (!token || !token.startsWith("fa-")) {
      return;
    }

    if (FONT_AWESOME_STYLE_TOKENS.has(token)) {
      if (styleIndex === -1) {
        styleIndex = index;
      }
      return;
    }

    if (iconIndex === -1) {
      iconIndex = index;
    }
  });

  const consumed = new Set();
  let iconClass = "";

  if (iconIndex !== -1) {
    const styleToken = styleIndex !== -1 ? tokens[styleIndex] : "fa-solid";
    iconClass = `${styleToken} ${tokens[iconIndex]}`;
    consumed.add(iconIndex);
    if (styleIndex !== -1) {
      consumed.add(styleIndex);
    }
  }

  const remainingTokens = tokens.filter((_, index) => !consumed.has(index));
  return { iconClass, remainingTokens };
};

const renderMarkdownBlock = (text) =>
  hexo.render
    .renderSync({
      text,
      engine: "markdown",
    })
    .trim();

const renderMarkdownInline = (text) => {
  const normalized = String(text ?? "").trimStart();
  const rendered = renderMarkdownBlock(normalized);
  return rendered.replace(/^<p>([\s\S]*)<\/p>$/, "$1");
};

const parseSimpleArgs = (args) => {
  const tokens = args.filter(Boolean);
  const type = tokens[0] || DEFAULT_TYPE;
  const { iconClass, remainingTokens } = extractIcon(tokens.slice(1));

  return {
    variant: "simple",
    type,
    iconClass,
    title: "",
    extraClasses: remainingTokens,
  };
};

const parseTitledArgs = (args, defaultTitle) => {
  const tokens = args.filter(Boolean);
  const type = tokens[0] || DEFAULT_TYPE;
  const { iconClass, remainingTokens } = extractIcon(tokens.slice(1));
  const title = remainingTokens.join(" ").trim() || defaultTitle;

  return {
    variant: "titled",
    type,
    iconClass,
    title,
    extraClasses: [],
  };
};

const parseDelimitedArgs = (rawArgs, defaultTitle) => {
  const delimiterIndex = rawArgs.indexOf("::");
  const left = delimiterIndex === -1 ? rawArgs : rawArgs.slice(0, delimiterIndex);
  const right = delimiterIndex === -1 ? "" : rawArgs.slice(delimiterIndex + 2);

  const tokens = tokenize(left);
  const type = tokens[0] || DEFAULT_TYPE;
  const { iconClass, remainingTokens } = extractIcon(tokens.slice(1));
  const title = right.trim() || defaultTitle;

  return {
    variant: "titled",
    type,
    iconClass,
    title,
    extraClasses: remainingTokens,
  };
};

const parseNamedArgs = (rawArgs) => {
  const parsedArgs = parseTagArgs(rawArgs);
  const supportsNamed = ["type", "title", "icon", "class", "classes", "variant"]
    .some((key) => parsedArgs.named[key] != null);

  if (!hasNamedArgs(parsedArgs) || !supportsNamed) {
    return null;
  }

  const positionalParsed = parseSimpleArgs(parsedArgs.positional);
  const namedType = getNamedString(parsedArgs.named, "type", "").trim();
  const namedIcon = getNamedString(parsedArgs.named, "icon", "").trim();
  const namedTitle = getNamedString(parsedArgs.named, "title", "").trim();
  const variant = getNamedString(parsedArgs.named, "variant", "").trim();
  const classNames = splitClassNames(getNamedString(parsedArgs.named, "class", ""));
  const classesAlias = splitClassNames(getNamedString(parsedArgs.named, "classes", ""));

  const normalizedVariant = variant === "titled" || namedTitle
    ? "titled"
    : variant === "simple"
      ? "simple"
      : positionalParsed.variant;

  return {
    variant: normalizedVariant,
    type: namedType || positionalParsed.type,
    iconClass: namedIcon || positionalParsed.iconClass,
    title: namedTitle,
    extraClasses: [...positionalParsed.extraClasses, ...classNames, ...classesAlias],
  };
};

const buildIconMarkup = (iconClass) => {
  if (!iconClass) {
    return "";
  }

  return `<i class="callout__icon ${iconClass} leading-none text-(--callout-primary-color) text-sm shrink-0"></i>`;
};

const renderSimpleCallout = ({ type, iconClass, extraClasses }, content) => {
  const iconMarkup = buildIconMarkup(iconClass);
  const renderedContent = renderMarkdownBlock(content);

  return html`
    <div class="${cn("callout callout--simple", type, extraClasses, "mb-4 rounded-small shadow-redefine-flat bg-(--callout-bg-color) p-3 pl-1 relative flex flex-row gap-2 items-center")}">
      <div role="none" class="rounded-full self-stretch w-0.5 bg-(--callout-primary-color) shrink-0 opacity-60"></div>
      ${iconMarkup}
      <div class="${cn("callout__content markdown-body flex-1 min-w-0")}">${renderedContent}</div>
    </div>
  `;
};

const renderTitledCallout = ({ type, iconClass, title, extraClasses }, content) => {
  const iconMarkup = buildIconMarkup(iconClass);
  const renderedTitle = renderMarkdownInline(title || DEFAULT_TITLE);
  const renderedContent = renderMarkdownBlock(content);
  const titleInner = iconMarkup ? `${iconMarkup} ${renderedTitle}` : renderedTitle;

  return html`
    <div class="${cn("callout callout--titled", type, extraClasses, "mb-4 rounded-small shadow-redefine-flat bg-(--callout-bg-color) p-3 pl-1 relative flex flex-row gap-2")}">
      <div role="none" class="rounded-full self-stretch w-0.5 bg-(--callout-primary-color) shrink-0 opacity-60"></div>
      <div class="flex flex-col gap-2">
        <div class="callout__title flex items-center gap-2 font-semibold tracking-tight">${titleInner}</div>
        <div class="${cn("callout__content markdown-body flex-1 min-w-0")}">${renderedContent}</div>
      </div>
    </div>
  `;
};

const renderCallout = (parsed, content) => {
  if (parsed.variant === "titled") {
    return renderTitledCallout(parsed, content);
  }

  return renderSimpleCallout(parsed, content);
};

const postCallout = (args, content) => {
  const rawArgs = args.join(" ").trim();
  const parsed = parseNamedArgs(rawArgs) || (rawArgs.includes("::")
    ? parseDelimitedArgs(rawArgs, DEFAULT_TITLE)
    : parseSimpleArgs(args));

  return renderCallout(parsed, content);
};

const postLegacyNote = (args, content) =>
  renderCallout(parseSimpleArgs(args), content);
const postLegacyNoteLarge = (args, content) =>
  renderCallout(parseTitledArgs(args, LEGACY_TITLED_DEFAULT_TITLE), content);

const warnLegacyNoteTag = (tagName, variant) => {
  const legacyTag = `{% ${tagName} %}`;
  const replacement = variant === "titled"
    ? "{% callout type=\"...\" title=\"...\" %}"
    : "{% callout type=\"...\" %}";

  warnOnce({
    hexo,
    id: `tag.deprecation.legacy_note.${tagName}`,
    message: `Tag deprecation: \`${legacyTag}\` is deprecated and will be removed in the next major release; use \`${replacement}\` instead. Read documentation: https://redefine-docs.ohevan.com/zh/docs/modules/callout`,
  });
};

hexo.extend.tag.register("callout", postCallout, { ends: true });

const simpleTags = ["note", "notes", "subnote"];
const titledTags = [
  "noteL",
  "notel",
  "notelarge",
  "notel-large",
  "notes-large",
  "subwarning",
];

simpleTags.forEach((tag) => {
  hexo.extend.tag.register(tag, (args, content) => {
    warnLegacyNoteTag(tag, "simple");
    return postLegacyNote(args, content);
  }, { ends: true });
});

titledTags.forEach((tag) => {
  hexo.extend.tag.register(tag, (args, content) => {
    warnLegacyNoteTag(tag, "titled");
    return postLegacyNoteLarge(args, content);
  }, { ends: true });
});

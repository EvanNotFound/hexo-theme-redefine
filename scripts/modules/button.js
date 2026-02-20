"use strict";

const {
  parseTagArgs,
  hasNamedArgs,
  getNamedString,
} = require("../utils/tag-args");
const { html } = require("../utils/html");
const { warnOnce } = require("../deprecations/warn");

const DEFAULT_REL = "noopener noreferrer";
const DEFAULT_SIZE = "md";
const DEFAULT_ALIGN = "inline";

const BUTTON_SIZE_CLASS = {
  sm: "small",
  md: "",
  lg: "large",
};

const BUTTON_ALIGN_CLASS = {
  inline: "",
  left: "left",
  center: "center",
  right: "right",
};

const cn = (...groups) =>
  groups
    .flat()
    .filter((value) => value && value.length > 0)
    .join(" ");

const looksLikeImage = (value) => {
  if (!value) {
    return false;
  }

  const normalized = String(value).trim();
  return /^https?:\/\//i.test(normalized)
    || normalized.startsWith("/")
    || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(normalized);
};

const parseVisualValue = (value) => {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return {
      iconClass: "",
      imageSrc: "",
    };
  }

  if (normalized.includes("fa-")) {
    return {
      iconClass: normalized,
      imageSrc: "",
    };
  }

  if (looksLikeImage(normalized)) {
    return {
      iconClass: "",
      imageSrc: normalized,
    };
  }

  return {
    iconClass: normalized,
    imageSrc: "",
  };
};

const normalizeLinkTarget = (value) => {
  const target = String(value ?? "").trim();
  return target || "";
};

const normalizeLinkRel = (rel, target) => {
  const normalizedRel = String(rel ?? "").trim();
  if (normalizedRel) {
    return normalizedRel;
  }

  return target === "_blank" ? DEFAULT_REL : "";
};

const normalizeSize = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "sm" || normalized === "small") {
    return "sm";
  }

  if (normalized === "lg" || normalized === "large") {
    return "lg";
  }

  return DEFAULT_SIZE;
};

const normalizeAlign = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "left" || normalized === "center" || normalized === "right") {
    return normalized;
  }

  return DEFAULT_ALIGN;
};

const parseLegacyDisplayOptions = (value) => {
  const tokens = String(value ?? "")
    .split(/\s+/)
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  let size = DEFAULT_SIZE;
  let align = DEFAULT_ALIGN;

  tokens.forEach((token) => {
    if (token === "sm" || token === "small") {
      size = "sm";
    } else if (token === "lg" || token === "large") {
      size = "lg";
    } else if (token === "left" || token === "center" || token === "right") {
      align = token;
    }
  });

  return {
    size,
    align,
  };
};

const parseNamedButtonArgs = (rawArgs) => {
  const parsedArgs = parseTagArgs(rawArgs);
  const supportsNamed = [
    "text",
    "label",
    "url",
    "href",
    "icon",
    "image",
    "img",
    "size",
    "align",
    "title",
    "target",
    "rel",
  ].some((key) => parsedArgs.named[key] != null);

  if (!hasNamedArgs(parsedArgs) || !supportsNamed) {
    return null;
  }

  const positional = parsedArgs.positional;
  const text = getNamedString(parsedArgs.named, "text", "").trim()
    || getNamedString(parsedArgs.named, "label", "").trim()
    || (positional[0] || "").trim();
  const url = getNamedString(parsedArgs.named, "url", "").trim()
    || getNamedString(parsedArgs.named, "href", "").trim()
    || (positional[1] || "").trim();

  const namedIcon = getNamedString(parsedArgs.named, "icon", "").trim();
  const namedImage = getNamedString(parsedArgs.named, "image", "").trim()
    || getNamedString(parsedArgs.named, "img", "").trim();

  const fallbackVisual = parseVisualValue(positional[2] || "");
  const visual = namedImage
    ? { iconClass: "", imageSrc: namedImage }
    : namedIcon
      ? { iconClass: namedIcon, imageSrc: "" }
      : fallbackVisual;

  const target = normalizeLinkTarget(getNamedString(parsedArgs.named, "target", ""));
  const rel = normalizeLinkRel(getNamedString(parsedArgs.named, "rel", ""), target);
  const size = normalizeSize(
    getNamedString(parsedArgs.named, "size", "") || positional[3],
  );
  const align = normalizeAlign(
    getNamedString(parsedArgs.named, "align", "") || positional[4],
  );

  return {
    text,
    url,
    iconClass: visual.iconClass,
    imageSrc: visual.imageSrc,
    size,
    align,
    title: getNamedString(parsedArgs.named, "title", "").trim() || text,
    target,
    rel,
  };
};

const parseLegacyButtonArgs = (rawArgs, args) => {
  const hasDelimiter = rawArgs.includes("::") || rawArgs.includes(",");
  const parts = hasDelimiter
    ? rawArgs
      .split(rawArgs.includes("::") ? "::" : ",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
    : args.map((value) => value.trim()).filter(Boolean);

  let styleToken = "";
  let text = "";
  let url = "";
  let visualValue = "";

  if (parts.length >= 4) {
    styleToken = parts[0] || "";
    text = parts[1] || "";
    url = parts[2] || "";
    visualValue = parts[3] || "";
  } else if (parts.length === 3) {
    const [first, second, third] = parts;
    if (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(second)) {
      text = first;
      url = second;
      visualValue = third;
    } else {
      styleToken = first;
      text = second;
      url = third;
    }
  } else if (parts.length === 2) {
    text = parts[0];
    url = parts[1];
  } else if (parts.length === 1) {
    text = parts[0];
  }

  const visual = parseVisualValue(visualValue);
  const displayOptions = parseLegacyDisplayOptions(styleToken);

  return {
    text,
    url,
    iconClass: visual.iconClass,
    imageSrc: visual.imageSrc,
    size: displayOptions.size,
    align: displayOptions.align,
    title: text,
    target: "",
    rel: "",
  };
};

const buildVisualMarkup = ({ iconClass, imageSrc, text }) => {
  if (iconClass) {
    return `<i class="${iconClass}" aria-hidden="true"></i>`;
  }

  if (imageSrc) {
    return `<img src="${imageSrc}" alt="${text}" loading="lazy">`;
  }

  return "";
};

const renderButton = (parsed) => {
  const text = parsed.text || "Button";
  const sizeClass = BUTTON_SIZE_CLASS[normalizeSize(parsed.size)] || "";
  const alignClass = BUTTON_ALIGN_CLASS[normalizeAlign(parsed.align)] || "";
  const className = cn("button not-markdown", sizeClass, alignClass);
  const hrefAttr = parsed.url ? ` href="${parsed.url}"` : "";
  const titleAttr = ` title="${parsed.title || text}"`;
  const targetAttr = parsed.target ? ` target="${parsed.target}"` : "";
  const relAttr = parsed.rel ? ` rel="${parsed.rel}"` : "";
  const visualMarkup = buildVisualMarkup({
    iconClass: parsed.iconClass,
    imageSrc: parsed.imageSrc,
    text,
  });
  const contentMarkup = visualMarkup ? `${visualMarkup} ${text}` : text;

  return html`
    <a class="${className}"${hrefAttr}${titleAttr}${targetAttr}${relAttr}>
      ${contentMarkup}
    </a>
  `;
};

const postButton = (args) => {
  const rawArgs = args.join(" ").trim();
  const parsed = parseNamedButtonArgs(rawArgs) || parseLegacyButtonArgs(rawArgs, args);
  return renderButton(parsed);
};

const postDeprecatedBtn = (args) => {
  warnOnce({
    hexo,
    id: "tag.deprecation.btn",
    message: "Tag deprecation: `{% btn %}` is deprecated and will be removed in the next major release; use `{% button %}` instead.",
  });

  return postButton(args);
};

const postDeprecatedCell = (args) => {
  warnOnce({
    hexo,
    id: "tag.deprecation.cell",
    message: "Tag deprecation: `{% cell %}` is deprecated and will be removed in the next major release; use `{% button %}` inside `{% grid %}` instead.",
  });

  return postButton(args);
};

hexo.extend.tag.register("button", postButton);
hexo.extend.tag.register("btn", postDeprecatedBtn);
hexo.extend.tag.register("cell", postDeprecatedCell);

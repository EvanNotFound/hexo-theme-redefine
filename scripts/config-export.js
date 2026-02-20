/* main hexo */

"use strict";

const url = require("url");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { ensurePrefix } = require("./utils/log-prefix");
const { version } = require("../package.json");

/**
 * Export theme config to js
 */
hexo.extend.helper.register("export_config", function () {
  let hexo_config = {
    hostname: new URL(this.config.url).hostname || this.config.url,
    root: this.config.root,
    language: this.config.language,
  };

  if (this.config.search) {
    hexo_config.path = this.config.search.path;
  }

  let theme_config = {
    articles: this.theme.articles,
    colors: this.theme.colors,
    global: this.theme.global,
    home_banner: this.theme.home_banner,
    plugins: this.theme.plugins,
    version: version,
    code_block: this.theme.code_block,
    navbar: this.theme.navbar,
    page_templates: this.theme.page_templates,
    home: this.theme.home,
    footer: this.theme.footer,

    footerStart: this.theme.footer?.start,
  };

  const normalizeSubtitle = (subtitle) => {
    if (Array.isArray(subtitle)) {
      return {
        text: subtitle,
      };
    }

    const normalized = {
      ...(subtitle || {}),
    };
    const text = normalized.text;

    if (Array.isArray(text)) {
      normalized.text = text;
    } else if (text) {
      normalized.text = [text];
    } else {
      normalized.text = [];
    }

    return normalized;
  };

  const normalizeMermaidTheme = (plugins = {}) => {
    const mermaidConfig = plugins.mermaid || {};
    const themeConfig = mermaidConfig.theme || {};
    const legacyTheme = this.theme?.mermaid?.style || {};

    return {
      light: themeConfig.light || legacyTheme.light || "default",
      dark: themeConfig.dark || legacyTheme.dark || "dark",
    };
  };

  theme_config.home_banner = {
    ...(theme_config.home_banner || {}),
    subtitle: normalizeSubtitle(theme_config.home_banner?.subtitle),
  };

  const mermaidTheme = normalizeMermaidTheme(theme_config.plugins || {});
  theme_config.plugins = {
    ...(theme_config.plugins || {}),
    mermaid: {
      ...(theme_config.plugins?.mermaid || {}),
      theme: mermaidTheme,
    },
  };
  theme_config.mermaid = {
    style: mermaidTheme,
  };

  const languageDir = path.join(__dirname, "../languages");
  const languageKey = Array.isArray(this.config.language)
    ? this.config.language[0]
    : this.config.language;
  let file = fs
    .readdirSync(languageDir)
    .find((v) => v === `${languageKey}.yml`);
  file = languageDir + "/" + (file ? file : "en.yml");
  let languageContent = fs.readFileSync(file, "utf8");
  try {
    languageContent = yaml.load(languageContent);
  } catch (e) {
    hexo.log.warn(ensurePrefix(`Failed to parse language file: ${e}`));
  }

  let data_config = {
    masonry: false,
  };

  if (this.theme.masonry) {
    data_config.masonry = true;
  }

  return `<script id="hexo-configurations">
    window.config = ${JSON.stringify(hexo_config)};
    window.theme = ${JSON.stringify(theme_config)};
    window.lang_ago = ${JSON.stringify(languageContent["ago"])};
    window.i18n = ${JSON.stringify(languageContent)};
    window.data = ${JSON.stringify(data_config)};
  </script>`;
});

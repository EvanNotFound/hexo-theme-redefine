/* main hexo */

"use strict";

const url = require("url");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { version } = require("../../package.json");

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

    footerStart: this.theme.footer.start,
  };

  const languageDir = path.join(__dirname, "../../languages");
  let file = fs
    .readdirSync(languageDir)
    .find((v) => v === `${this.config.language}.yml`);
  file = languageDir + "/" + (file ? file : "en.yml");
  let languageContent = fs.readFileSync(file, "utf8");
  try {
    languageContent = yaml.load(languageContent);
  } catch (e) {
    console.log(e);
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
    window.data = ${JSON.stringify(data_config)};
  </script>`;
});

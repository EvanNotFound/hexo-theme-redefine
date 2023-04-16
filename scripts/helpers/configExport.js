/* global hexo */

'use strict';

const url = require('url');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { version } = require('../../package.json');

/**
 * Export theme config to js
 */
hexo.extend.helper.register('export_config', function () {

  let {config, theme} = this;

  // ------------------------ export language to js ------------------------
  const languageDir = path.join(__dirname, '../../languages');
  let file = fs.readdirSync(languageDir).find(v => v === `${config.language}.yml`);
  file = languageDir + '/' + (file ? file : 'en.yml');
  let languageContent = fs.readFileSync(file, 'utf8');
  try {
    languageContent = yaml.load(languageContent);
  } catch (e) {
    console.log(e);
  }
  // -----------------------------------------------------------------------


  let hexo_config = {
    hostname: url.parse(config.url).hostname || config.url,
    root: config.root,
    language: config.language
  };

  if (config.search) {
    hexo_config.path = config.search.path;
  }

  let theme_config = {
    articles: theme.articles,
    colors: theme.colors,
    global: theme.global,
    home_banner: theme.home_banner,
    plugins: theme.plugins,
    version: version,
    code_block: theme.code_block,
    navbar: theme.navbar,
    page_templates: theme.page_templates,
    home: theme.home,
  }

  return `<script id="hexo-configurations">
    let Global = window.Global || {};
    Global.hexo_config = ${JSON.stringify(hexo_config)};
    Global.theme_config = ${JSON.stringify(theme_config)};
    Global.language_ago = ${JSON.stringify(languageContent['ago'])};
  </script>`;
});

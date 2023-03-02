/* global hexo */

'use strict';

const url = require('url');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

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
    toc: theme.toc,
    style: theme.style,
    local_search: theme.local_search,
    code_block: theme.code_block,
    side_tools: theme.side_tools,
    pjax: theme.pjax,
    lazyload: theme.lazyload,
    version: theme.version,
    friend_links: theme.friend_links,
    home_article: theme.home_article,
    plugins: theme.plugins,
  }

  return `<script id="hexo-configurations">
    let REDEFINE = window.REDEFINE || {};
    REDEFINE.hexo_config = ${JSON.stringify(hexo_config)};
    REDEFINE.theme_config = ${JSON.stringify(theme_config)};
    REDEFINE.language_ago = ${JSON.stringify(languageContent['ago'])};
  </script>`;
});

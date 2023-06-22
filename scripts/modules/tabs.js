/**
 * Module: Tabs
 * hexo-theme-redefine
 * By Evan
*/

'use strict';

const TAB_BLOCK_REGEX = /<!--\s*tab (.*?)\s*-->\n([\w\W\s\S]*?)<!--\s*endtab\s*-->/g;
const APLAYER_TAG_REGEX = /\<div.*class=\"aplayer aplayer-tag-marker\"(.|\n)*\<\/script\>/g;
const FANCYBOX_TAG_REGEX = /\<div.*galleryFlag(.|\n)*\<\/span\>\<\/div\>\<\/div\>/g;

function parseArgs(args) {
  if (/::/g.test(args)) {
    return args.join(' ').split('::');
  } else {
    return args.join(' ').split(',');
  }
}

function extractMatches(content) {
  const matches = [];
  let match;

  while ((match = TAB_BLOCK_REGEX.exec(content)) !== null) {
    matches.push(match[1]);
    matches.push(match[2]);
  }

  return matches;
}

function processAplayerTag(content) {
  let aplayerTag = 0;

  if (/class="aplayer aplayer-tag-marker"/g.test(content)) {
    aplayerTag = APLAYER_TAG_REGEX.exec(content)[0];
    content = content.replace(APLAYER_TAG_REGEX, "@aplayerTag@");
  }

  return { content, aplayerTag };
}

function processFancyboxTag(content) {
  let fancyboxTag = 0;

  if (/galleryFlag/g.test(content)) {
    fancyboxTag = FANCYBOX_TAG_REGEX.exec(content)[0];
    content = content.replace(FANCYBOX_TAG_REGEX, "@fancyboxTag@");
  }

  return { content, fancyboxTag };
}

function buildTabNavAndContent(matches, tabName, tabActive) {
  let tabNav = '';
  let tabContent = '';

  for (let i = 0; i < matches.length; i += 2) {
    const tabParameters = matches[i].split('@');
    const postContent = matches[i + 1];
    const tabCaption = tabParameters[0] || '';
    const tabIcon = tabParameters[1] || '';
    const tabHref = (tabName + ' ' + (i / 2 + 1)).toLowerCase().split(' ').join('-');

    const { content: contentWithAplayerTag, aplayerTag } = processAplayerTag(postContent);
    const { content: contentWithFancyboxTag, fancyboxTag } = processFancyboxTag(contentWithAplayerTag);

    const renderedContent = hexo.render.renderSync({ text: contentWithFancyboxTag, engine: 'markdown' }).trim();

    const finalContent = renderedContent.replace(/\<pre\>\<code\>.*@aplayerTag@.*\<\/code><\/pre>/, aplayerTag)
                                        .replace(/.*@fancyboxTag@.*/, fancyboxTag);

    const isActive = (tabActive > 0 && tabActive === (i / 2 + 1)) || (tabActive === 0 && i === 0) ? ' active' : '';

    tabNav += `<li class="tab${isActive}"><a class="#${tabHref}">${tabIcon + tabCaption.trim()}</a></li>`;
    tabContent += `<div class="tab-pane${isActive}" id="${tabHref}">${finalContent}</div>`;
  }

  return { tabNav, tabContent };
}

function postTabs(args, content) {
  const [tabName, tabActive] = parseArgs(args);
  const activeTabIndex = Number(tabActive) || 0;

  !tabName && hexo.log.warn('Tabs block must have unique name!');

  const matches = extractMatches(content);
  const { tabNav, tabContent } = buildTabNavAndContent(matches, tabName, activeTabIndex);

  const finalTabNav = `<ul class="nav-tabs">${tabNav}</ul>`;
  const finalTabContent = `<div class="tab-content">${tabContent}</div>`;
  return `<div class="tabs" id="tab-${tabName.toLowerCase().split(' ').join('-')}">${finalTabNav + finalTabContent}</div>`;
}

hexo.extend.tag.register('tabs', postTabs, { ends: true });
hexo.extend.tag.register('subtabs', postTabs, { ends: true });
hexo.extend.tag.register('subsubtabs', postTabs, { ends: true });

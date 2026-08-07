'use strict';

hexo.extend.filter.register('after_post_render', function(data) {
  const tableRegex = /<table(?![\s\S]*?class=["'].*?\bgutter\b.*?["'])[\s\S]*?<\/table>/g;
  data.content = data.content.replace(tableRegex, (match, offset, content) => {
    const precedingContent = content.slice(Math.max(0, offset - 80), offset);
    if (precedingContent.includes('table-scroll')) {
      return match;
    }

    return `<div class="table-scroll">${match}</div>`;
  });
  return data;
});

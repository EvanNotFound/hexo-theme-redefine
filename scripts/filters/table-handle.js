/*
'use strict';

hexo.extend.filter.register('after_post_render', function(data) {
  const tableRegex = /<table(?![\s\S]*?class=["'].*?\bgutter\b.*?["'])[\s\S]*?<\/table>/g;
  const wrappedTable = match => `<div class="table-container">${match}</div>`;
  data.content = data.content.replace(tableRegex, wrappedTable);
  return data;
});

*/
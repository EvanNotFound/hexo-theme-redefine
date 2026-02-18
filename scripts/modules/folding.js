'use strict';

const { renderMarkdownTagSafe } = require('../utils/markdown-swig');

async function postFolding(args, content) {
  const rawArgs = args.join(' ');
  const delimiter = rawArgs.includes('::') ? '::' : ',';
  const [style, title = ''] = rawArgs.split(delimiter).map((arg) => arg.trim());

  const renderedContent = await renderMarkdownTagSafe({
    hexo,
    content,
    postContext: this,
  });

  const processedContent = renderedContent.replace(
    /<(h[1-6])>/g,
    (_, tag) => `<p class='${tag}'>`,
  ).replace(
    /<\/(h[1-6])>/g,
    () => '</p>',
  );

  const styleAttr = style ? ` class="${style}"` : '';

  return `<details${styleAttr} data-header-exclude>
    <summary><i class="fa-solid fa-chevron-right"></i>${title} </summary>
    <div class='content markdown-body'>
      ${processedContent}
    </div>
  </details>`;
}

hexo.extend.tag.register('folding', postFolding, { ends: true, async: true });

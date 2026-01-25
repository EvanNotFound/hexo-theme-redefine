'use strict';

const postFolding = (args, content) => {
  // Parse arguments - support both '::' and ',' as delimiters
  const delimiter = args.join(' ').includes('::') ? '::' : ',';
  const [style, title = ''] = args.join(' ').split(delimiter).map(arg => arg.trim());
  
  //fixed issue#572 by removing spaces at the begining and the end of each line.
  const preRendered = hexo.render.renderSync({ 
    text: content, 
    engine: 'nunjucks' 
  }).split('\n').map(line => line.trim()).join('\n');

  // Render markdown content
  const renderedContent = hexo.render.renderSync({
    text: preRendered, 
    engine: 'markdown'
  });
  
  // Replace heading tags with paragraph tags that have heading classes
  const processedContent = renderedContent.replace(
    /<(h[1-6])>/g, 
    (_, tag) => `<p class='${tag}'>`
  ).replace(
    /<\/(h[1-6])>/g, 
    () => '</p>'
  );
  
  // Build the HTML with or without custom style
  const styleAttr = style ? ` class="${style}"` : '';
  
  return `<details${styleAttr} data-header-exclude>
    <summary><i class="fa-solid fa-chevron-right"></i>${title} </summary>
    <div class='content markdown-body'>
      ${processedContent}
    </div>
  </details>`;
};

hexo.extend.tag.register('folding', postFolding, {ends: true});

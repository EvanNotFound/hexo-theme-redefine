/**
 * note.js
 * transplant from hexo-theme-butterfly
 * Modified by Evan
 */

// 处理 del 标签
function processDelTags(renderedContent, theme) {

  // 正则表达式匹配 <del> 标签，考虑HTML实体编码
  const regPureDelTag = /<del>(.*?)<\/del>/gi;
  return renderedContent.replace(regPureDelTag, function (match, html) {
    if (theme.config.articles.style.delete_mask === true) {
      // 将HTML实体编码还原为正常字符
      const unescapedHtml = html.replace(/&#x2F;/g, '/');
      return `<del class="mask">${unescapedHtml}</del>`;
    }
    return match;
  });
}

function postNote(args, content) {
  if (args.length === 0) {
    args.push("default");
  }

  let icon = "";
  const iconArray = args[args.length - 1];
  if (iconArray && iconArray.startsWith("fa")) {
    icon = `<i class="note-icon fa-solid ${iconArray}"></i>`;
    args[args.length - 1] = "icon-padding";
  }

  // 先渲染 markdown
  const renderedContent = hexo.render.renderSync({
    text: content,
    engine: "markdown",
  });

  // 再处理 del 标签
  const processedContent = processDelTags(renderedContent, hexo.theme);

  return `
  <div class="note p-4 mb-4 rounded-small ${args.join(" ")}">
    ${icon}${processedContent}
  </div>`;
}

hexo.extend.tag.register("note", postNote, { ends: true });
hexo.extend.tag.register("notes", postNote, { ends: true });
hexo.extend.tag.register("subnote", postNote, { ends: true });

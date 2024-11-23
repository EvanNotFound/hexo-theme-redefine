// 处理 del 标签
function processDelTags(renderedContent, theme) {
  const regPureDelTag = /<del>(.*?)<\/del>/gim;
  return renderedContent.replace(regPureDelTag, function (match, html) {
    if (theme.config.articles.style.delete_mask === true) {
      return `<del class="mask">${html}</del>`;
    }
    return match;
  });
}

function postNoteLarge(args, content) {
  if (args.length === 0) {
    args.push("default", "Warning");
  }

  let icon = "";
  const iconArray = args[1];
  if (iconArray && iconArray.startsWith("fa")) {
    icon = `<i class="notel-icon fa-solid ${iconArray}"></i>`;
    args[1] = "icon-padding";
  }

  // 先渲染 Markdown
  const renderedTitle = hexo.render.renderSync({
    text: args[args.length - 1],
    engine: "markdown",
  });
  const renderedContent = hexo.render.renderSync({
    text: content,
    engine: "markdown",
  });

  // 再处理 del 标签
  const processedTitle = processDelTags(renderedTitle, hexo.theme);
  const processedContent = processDelTags(renderedContent, hexo.theme);

  return `
  <div class="note-large ${args[0]}">
    <div class="notel-title rounded-t-lg p-3 font-bold text-lg flex flex-row gap-2 items-center">
      ${icon}${processedTitle}
    </div>
    <div class="notel-content">
      ${processedContent}
    </div>
  </div>`;
}

hexo.extend.tag.register("noteL", postNoteLarge, { ends: true });
hexo.extend.tag.register("notel", postNoteLarge, { ends: true });
hexo.extend.tag.register("notelarge", postNoteLarge, { ends: true });
hexo.extend.tag.register("notel-large", postNoteLarge, { ends: true });
hexo.extend.tag.register("notes-large", postNoteLarge, { ends: true });
hexo.extend.tag.register("subwarning", postNoteLarge, { ends: true });

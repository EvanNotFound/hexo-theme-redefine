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

  return `
  <div class="note-large ${args[0]}">
    <div class="notel-title rounded-t-lg p-3 font-bold text-lg flex flex-row gap-2 items-center">
      ${icon}${hexo.render.renderSync({
        text: args[args.length - 1],
        engine: "markdown",
      })}
    </div>
    <div class="notel-content">
      ${hexo.render.renderSync({
        text: content,
        engine: "markdown",
      })}
    </div>
  </div>`;
}

hexo.extend.tag.register("noteL", postNoteLarge, { ends: true });
hexo.extend.tag.register("notel", postNoteLarge, { ends: true });
hexo.extend.tag.register("notelarge", postNoteLarge, { ends: true });
hexo.extend.tag.register("notel-large", postNoteLarge, { ends: true });
hexo.extend.tag.register("notes-large", postNoteLarge, { ends: true });
hexo.extend.tag.register("subwarning", postNoteLarge, { ends: true });
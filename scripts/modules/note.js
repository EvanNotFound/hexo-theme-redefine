/**
 * note.js
 * transplant from hexo-theme-butterfly
 * Modified by Evan
 */

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

  return `<div class="note ${args.join(" ")}">${icon}${hexo.render.renderSync({
    text: content,
    engine: "markdown"
  })}</div>`;
}

hexo.extend.tag.register("note", postNote, { ends: true });
hexo.extend.tag.register("notes", postNote, { ends: true });
hexo.extend.tag.register("subnote", postNote, { ends: true });

/**
 * note.js
 * transplant from hexo-theme-butterfly
 * Modify by Evan
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

  if (args[0] === "default") {
    icon = `<i class="note-icon fa-solid fa-info-circle"></i>`;
    args[0] = "note-default";
    args.push("icon-padding");
  } else if (args[0] === "info") {
    icon = `<i class="note-icon fa-solid fa-info-circle"></i>`;
    args[0] = "note-info";
    args.push("icon-padding");
  } else if (args[0] === "success") {
    icon = `<i class="note-icon fa-solid fa-check-circle"></i>`;
    args[0] = "note-success";
    args.push("icon-padding");
  } else if (args[0] === "warning") {
    icon = `<i class="note-icon fa-solid fa-exclamation-circle"></i>`;
    args[0] = "note-warning";
    args.push("icon-padding");
  } else if (args[0] === "danger") {
    icon = `<i class="note-icon fa-solid fa-times-circle"></i>`;
    args[0] = "note-danger";
    args.push("icon-padding");
  } else if (args[0] === "tip") {
    icon = `<i class="note-icon fa-solid fa-lightbulb"></i>`;
    args[0] = "note-tip";
    args.push("icon-padding");
  } else if (args[0] === "question") {
    icon = `<i class="note-icon fa-solid fa-question-circle"></i>`;
    args[0] = "note-question"; 
    args.push("icon-padding");
  } else if (args[0] === "help") {
    icon = `<i class="note-icon fa-solid fa-question-circle"></i>`;
    args[0] = "note-help";
    args.push("icon-padding");
  } else if (args[0] === "note") {
    icon = `<i class="note-icon fa-solid fa-sticky-note"></i>`;
    args[0] = "note-note";
    args.push("icon-padding");
  } else if (args[0] === "primary") {
    icon = `<i class="note-icon fa-solid fa-circle-arrow-right"></i>`;
    args[0] = "note-primary";
    args.push("icon-padding");
  } else if (!args[0].startsWith("note-") && !args[0].startsWith("fa")) {
    args[0] = "note-" + args[0];
  }

  return `<div class="note ${args.join(" ")}">${
    icon + hexo.render.renderSync({ text: content, engine: "markdown" })
  }</div>`;
}

hexo.extend.tag.register("note", postNote, { ends: true });
hexo.extend.tag.register("notes", postNote, { ends: true });
hexo.extend.tag.register("subnote", postNote, { ends: true });

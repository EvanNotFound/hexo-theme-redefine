/**
 * warning.js
 * transplant from hexo-theme-butterfly
 * Modify by Evan
 */

function postNoteLarge(args, content) {
  if (args.length === 0) {
    args.push("default", "Warning");
  }

  if (args[0] === "default") {
    icon = `<i class="notel-icon fa-solid fa-info-circle"></i>`;
    args[0] = "notel-default";
    args.push("icon-padding");
  } else if (args[0] === "info") {
    icon = `<i class="notel-icon fa-solid fa-info-circle"></i>`;
    args[0] = "notel-info";
    args.push("icon-padding");
  } else if (args[0] === "success") {
    icon = `<i class="notel-icon fa-solid fa-check-circle"></i>`;
    args[0] = "notel-success";
    args.push("icon-padding");
  } else if (args[0] === "warning") {
    icon = `<i class="notel-icon fa-solid fa-exclamation-circle"></i>`;
    args[0] = "notel-warning";
    args.push("icon-padding");
  } else if (args[0] === "danger") {
    icon = `<i class="notel-icon fa-solid fa-times-circle"></i>`;
    args[0] = "notel-danger";
    args.push("icon-padding");
  } else if (args[0] === "tip") {
    icon = `<i class="notel-icon fa-solid fa-lightbulb"></i>`;
    args[0] = "notel-tip";
    args.push("icon-padding");
  } else if (args[0] === "question") {
    icon = `<i class="notel-icon fa-solid fa-question-circle"></i>`;
    args[0] = "notel-question"; 
    args.push("icon-padding");
  } else if (args[0] === "help") {
    icon = `<i class="notel-icon fa-solid fa-question-circle"></i>`;
    args[0] = "notel-help";
    args.push("icon-padding");
  } else if (args[0] === "note") {
    icon = `<i class="notel-icon fa-solid fa-sticky-note"></i>`;
    args[0] = "notel-note";
    args.push("icon-padding");
  } else if (args[0] === "primary") {
    icon = `<i class="notel-icon fa-solid fa-circle-arrow-right"></i>`;
    args[0] = "notel-primary";
    args.push("icon-padding");
  } else if (!args[0].startsWith("notel-") && !args[0].startsWith("fa")) {
    args[0] = "notel-" + args[0];
  }



  return `<div class="note-large ${args[0]}"><div class="notel-title">${hexo.render.renderSync({
    text: args[1],
    engine: "markdown",
  })}</div><div class="notel-content">${hexo.render.renderSync({
    text: content,
    engine: "markdown",
  })} </div></div>`;
}

hexo.extend.tag.register("noteL", postNoteLarge, { ends: true });
hexo.extend.tag.register("notel", postNoteLarge, { ends: true });
hexo.extend.tag.register("notelarge", postNoteLarge, { ends: true });
hexo.extend.tag.register("notel-large", postNoteLarge, { ends: true });
hexo.extend.tag.register("notes-large", postNoteLarge, { ends: true });
hexo.extend.tag.register("subwarning", postNoteLarge, { ends: true });

function postNote(args, content) {
  if (args.length === 0) {
    args.push("default");
  }

  let icon = "";
  
  // Extract style classes from all args except potential icon classes
  let classes = [];
  const remainingArgs = [...args]; // Copy args array
  
  // Add first arg as main class
  if (remainingArgs.length > 0) {
    classes.push(remainingArgs[0]);
    remainingArgs.shift();
  }
  
  // Find all fa- prefixed arguments
  const faArgs = [];
  const faIndices = [];
  
  remainingArgs.forEach((arg, index) => {
    if (arg && arg.startsWith('fa-')) {
      faArgs.push(arg);
      faIndices.push(index);
    }
  });
  
  // Handle FontAwesome icons based on how many fa- args we found
  if (faArgs.length === 2) {
    // Two fa- args: first is style, second is icon
    icon = `<i class="note-icon ${faArgs[0]} ${faArgs[1]}"></i>`;
    
    // Remove both FA args (remove higher index first to preserve positions)
    remainingArgs.splice(faIndices[1], 1);
    remainingArgs.splice(faIndices[0], 1);
  } else if (faArgs.length === 1) {
    // One fa- arg: it's the icon, default to fa-solid
    icon = `<i class="note-icon fa-solid ${faArgs[0]}"></i>`;
    
    // Remove the FA arg
    remainingArgs.splice(faIndices[0], 1);
  }
  
  // Add any remaining args as additional classes
  classes = classes.concat(remainingArgs);
  
  // Add icon-padding class if icon exists
  if (icon) {
    classes.push("icon-padding");
  }

  return `
  <div class="note p-4 mb-4 rounded-small markdown-body ${classes.join(" ")}">
    ${icon}${hexo.render.renderSync({
      text: content,
      engine: "markdown",
    })}
  </div>`;
}

hexo.extend.tag.register("note", postNote, { ends: true });
hexo.extend.tag.register("notes", postNote, { ends: true });
hexo.extend.tag.register("subnote", postNote, { ends: true });
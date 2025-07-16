function postNoteLarge(args, content) {
  if (args.length === 0) {
    args.push("default", "Warning");
  }

  let icon = "";
  let title = "";
  
  // Extract color from args[0]
  const color = args[0];
  
  // Process all arguments after color to build icon and title
  const remainingArgs = args.slice(1);
  
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
    icon = `<i class="notel-icon ${faArgs[0]} ${faArgs[1]}"></i>`;
    
    // Remove both FA args (remove higher index first to preserve positions)
    remainingArgs.splice(faIndices[1], 1);
    remainingArgs.splice(faIndices[0], 1);
  } else if (faArgs.length === 1) {
    // One fa- arg: it's the icon, default to fa-solid
    icon = `<i class="notel-icon fa-solid ${faArgs[0]}"></i>`;
    
    // Remove the FA arg
    remainingArgs.splice(faIndices[0], 1);
  }
  
  // Join all remaining args as the title
  title = remainingArgs.join(" ");
  
  // If no title was provided, set a default
  if (!title) {
    title = "Note";
  }

  return `
  <div class="note-large ${color}">
    <div class="notel-title rounded-t-lg p-3 font-bold text-lg flex flex-row gap-2 items-center">
      ${icon}${hexo.render.renderSync({
        text: title,
        engine: "markdown",
      })}
    </div>
    <div class="notel-content markdown-body">
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
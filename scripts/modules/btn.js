"use strict";

/**
 * Single Button module for Hexo theme Redefine
 * Creates standalone button elements
 */

/**
 * Creates a single button
 * 
 * @param {Array} args - Button arguments (class, text, url, icon)
 * @returns {String} HTML for a single button
 */
function postBtn(args) {
  // Parse arguments - support both '::' and ',' as separators
  let parsedArgs;
  const argsStr = args.join(" ");
  
  if (argsStr.includes("::")) {
    parsedArgs = argsStr.split("::");
  } else {
    parsedArgs = argsStr.split(",");
  }
  
  // Default values
  let cls = "";
  let text = "";
  let url = "";
  let icon = "";
  
  // Parse arguments based on count
  switch(parsedArgs.length) {
    case 4: // class, text, url, icon
      cls = parsedArgs[0];
      text = parsedArgs[1];
      url = parsedArgs[2];
      icon = parsedArgs[3];
      break;
      
    case 3:
      // Check if third arg is an icon (contains fa-)
      if (parsedArgs[2].includes("fa-")) {
        // text, url, icon
        text = parsedArgs[0];
        url = parsedArgs[1];
        icon = parsedArgs[2];
      } else {
        // class, text, url
        cls = parsedArgs[0];
        text = parsedArgs[1];
        url = parsedArgs[2];
      }
      break;
      
    case 2: // text, url
      text = parsedArgs[0];
      url = parsedArgs[1];
      break;
      
    case 1: // text only
      text = parsedArgs[0];
      break;
  }
  
  // Clean up values
  cls = cls.trim();
  icon = icon.trim();
  text = text.trim();
  url = url.trim();
  
  // Build attributes
  const hrefAttr = url ? `href='${url}'` : '';
  const classAttr = cls ? `${cls}` : '';
  
  // Build button HTML
  if (icon) {
    return `<a class="button ${classAttr}" ${hrefAttr} title='${text}'><i class='${icon}'></i> ${text}</a>`;
  }
  
  return `<a class="button ${classAttr}" ${hrefAttr} title='${text}'>${text}</a>`;
}

// Register Hexo tags
hexo.extend.tag.register("btn", postBtn);
hexo.extend.tag.register("button", postBtn);

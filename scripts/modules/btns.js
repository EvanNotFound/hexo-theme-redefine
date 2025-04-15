'use strict';

/**
 * Buttons module for Hexo theme Redefine
 * Creates button containers and button elements
 */

/**
 * Creates a buttons container
 * 
 * @param {Array} args - Class names for the container
 * @param {String} content - Button content (cells)
 * @returns {String} HTML for the buttons container
 */
function postBtns(args, content) {
  const classes = args.join(' ');
  return `<div class="btns ${classes}">
            ${content}
          </div>`;
}

/**
 * Creates a single button cell
 * 
 * @param {Array} args - Button properties (text, url, icon/image)
 * @returns {String} HTML for a single button
 */
function postCell(args, content) {
  // Parse arguments - support both '::' and ',' as separators
  let parsedArgs;
  const argsStr = args.join(' ');
  
  if (argsStr.includes('::')) {
    parsedArgs = argsStr.split('::');
  } else {
    parsedArgs = argsStr.split(',');
  }
  
  // Extract button properties
  const text = (parsedArgs[0] || '').trim();
  const url = (parsedArgs[1] || '').trim();
  const buttonClasses = ['button'];
  
  // Handle URL
  const hrefAttr = url ? `href='${url}'` : '';
  
  // Handle icon or image
  let iconOrImage = '';
  
  if (parsedArgs.length > 2) {
    const iconOrImgSrc = parsedArgs[2].trim();
    
    // Check if it's a FontAwesome icon
    if (iconOrImgSrc.includes('fa-')) {
      iconOrImage = `<i class='${iconOrImgSrc}'></i> `;
    } else {
      // Use specified image or default
      const imgSrc = iconOrImgSrc || hexo.theme.config.default.image;
      iconOrImage = `<img src='${imgSrc}'>`;
    }
  }
  
  // Return complete button HTML
  return `<a class="${buttonClasses.join(' ')}" ${hrefAttr} title='${text}'>${iconOrImage}${text}</a>`;
}

// Register Hexo tags
hexo.extend.tag.register('btns', postBtns, {ends: true});
hexo.extend.tag.register('buttons', postBtns, {ends: true});
hexo.extend.tag.register('cell', postCell);


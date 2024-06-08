hexo.extend.helper.register('waline_reaction_config', function(reactionConfig) {
  if (Array.isArray(reactionConfig) && reactionConfig.length) {
    return `[${reactionConfig.map(item => `'${item}'`).join(', ')}]`;
  } else {
    return Boolean(reactionConfig);
  }
});
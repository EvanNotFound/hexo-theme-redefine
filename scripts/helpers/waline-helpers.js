hexo.extend.helper.register('waline_reaction_config', function(reactionConfig) {
  if (Array.isArray(reactionConfig) && reactionConfig.length) {
    return `[${reactionConfig.map(item => `'${item}'`).join(', ')}]`;
  } else {
    return Boolean(reactionConfig);
  }
});

hexo.extend.helper.register('waline_array_config', function(arrayConfig) {
  if (Array.isArray(arrayConfig) && arrayConfig.length) {
    return `[${arrayConfig.map(item => `'${item}'`).join(', ')}]`;
  }
  return '[]';
});

hexo.extend.helper.register('waline_config_options', function(config) {
  if (!config || typeof config !== 'object') return '';
  
  const formatValue = (value) => {
    if (typeof value === 'string') {
      return `'${value}'`;
    }
    if (Array.isArray(value)) {
      return `[${value.map(item => typeof item === 'string' ? `'${item}'` : item).join(', ')}]`;
    }
    return value;
  };
  
  return Object.entries(config)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `          ${key}: ${formatValue(value)},`)
    .join('\n');
});
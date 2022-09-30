hexo.on('generateBefore', function () {

  if (hexo.locals.get) {
    const data = hexo.locals.get('data');

    if (data) {

      // theme config file handle
      if (data._config) {
        hexo.theme.config = data._config;

      } else if (data.keep) {
        hexo.theme.config = data.keep;

      } else if (data._keep) {
        hexo.theme.config = data._keep;
      }

      // friends link file handle
      if (data.links || data.link) {
        hexo.theme.config.links = (data.links || data.link);
      }

    }
  }
});

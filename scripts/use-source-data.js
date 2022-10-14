hexo.on('generateBefore', function () {

  if (hexo.locals.get) {
    const data = hexo.locals.get('data');

    if (data) {

      // theme config file handle
      if (data._config) {
        hexo.theme.config = data._config;

      } else if (data.redefine) {
        hexo.theme.config = data.redefine;

      } else if (data._redefine) {
        hexo.theme.config = data._redefine;
      }

      // friends link file handle
      if (data.links || data.link) {
        hexo.theme.config.links = (data.links || data.link);
      }

    }
  }
});

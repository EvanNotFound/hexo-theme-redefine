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

      if (data.essays || data.essay || data.shuoshuo) {
        hexo.theme.config.essays = (data.essays || data.essay || data.shuoshuo);
      }

      if (data.masonry || data.gallery || data.photos) {
        hexo.theme.config.masonry = (data.masonry || data.gallery || data.photos);
      }

      if (data.bookmarks || data.tools) {
        hexo.theme.config.bookmarks = data.bookmarks || data.tools;
      }

    }
  }
});

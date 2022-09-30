'use strict'
hexo.extend.filter.register(
  'after_post_render',
  function (data) {
    const theme = hexo.theme.config;
    if (!theme.lazyload || !theme.lazyload.enable) return;
    data.content = data.content.replace(
      // Match 'img' tags width the src attribute.
      /<img([^>]*)src="([^"]*)"([^>\/]*)\/?\s*>/gim,
      function (match, attrBegin, src, attrEnd) {
        // Exit if the src doesn't exists.
        if (!src) return match;

        return `<img ${attrBegin}
                     lazyload
                     src="/images/loading.svg"
                     data-src="${src}"
                     ${attrEnd}
                >`
      }
    )
  },
  1
);

'use strict'
hexo.extend.filter.register(
  'after_post_render',
  function (data) {
    const theme = hexo.theme.config;
    if (!theme.articles.lazyload || !theme.articles.lazyload) return;
    data.content = data.content.replace(
      // Match 'img' tags width the src attribute.
      /<img([^>]*)src="([^"]*)"([^>\/]*)\/?\s*>/gim,
      function (match, attrBegin, src, attrEnd) {
        // Exit if the src doesn't exists.
        if (!src) return match;

        return `<img ${attrBegin}
                     src="/images/loading.svg"
                     data-lazy-src="${src}"
                     data-lazy-state="pending"
                     ${attrEnd}
                >`
      }
    )
  },
  1
);

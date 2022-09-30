/* global hexo */

'use strict'

hexo.extend.filter.register('after_post_render', function (data) {

    const config = this.config;
    const url = new URL(config.url);
    const siteHost = url.hostname || config.url;

    // Match 'a' tags that don't contain html children.
    const regPureATag = /<a([^>]*)href="([^"]*)"([^>]*)>([^<]*)<\/a>/gim

    data.content = data.content.replace(regPureATag, function (
      match,
      attrBegin,
      href,
      attrEnd,
      html
    ) {
      // Exit if the href attribute doesn't exists.
      if (!href) return match;

      let link = '';
      try {
        link = new URL(href);
      } catch (e) {
        // Invalid url, e.g. Anchor link.
        return match;
      }

      // Exit if the url has same host with `config.url`, which means isn't an external link.
      if (!link.protocol || link.hostname === siteHost) return match;

      return (
        `<a class="link" ${attrBegin} href="${href}" ${attrEnd}>${html}<i class="fas fa-external-link-alt"></i></a>`
      )
    })
  },
  0
)

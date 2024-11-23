/* delete mask */

"use strict";

hexo.extend.filter.register(
  "after_post_render",
  function (data) {
    const theme = this.theme;

    // 处理del标签的代码
    const regPureDelTag = /<del(?:\s+[^>]*)?>((?:(?!<\/?del[\s>])[^])*)<\/del>/g;

    data.content = data.content.replace(
      regPureDelTag,
      function (match, html) {
        // 只有在配置为true时才添加mask类
        if (theme.config.articles.style.delete_mask === true) {
          return `<del class="mask">${html}</del>`;
        }
        return match;
      }
    );

    return data;
  },
  0
);

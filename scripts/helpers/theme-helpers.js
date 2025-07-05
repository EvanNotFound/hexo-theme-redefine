/* main hexo */

"use strict";

const url = require("url");
const { version } = require("../../package.json");
const themeVersion = version;

hexo.extend.helper.register("isHomePagePagination", function (pagePath, route) {
  if (pagePath.length > 5 && route === "/") {
    return pagePath.slice(0, 5) === "page/";
  }

  return false;
});

/* code block language display */
hexo.extend.filter.register("after_post_render", function (data) {
  // Only process if not already processed
  if (data._processedHighlight) return data;
  
  // Updated pattern to include numbers and other special characters
  const pattern = /<figure class="highlight ([^"]+)">([\s\S]*?)<\/figure>/g;
  data.content = data.content.replace(pattern, function (match, p1, p2) {
    // If already has code-container anywhere in the match, return unchanged
    if (match.includes('code-container')) {
      return match;
    }

    let language = p1 || "code";
    if (language === "plain") {
      language = "code";
    }

    return '<div class="code-container" data-rel="' +
      language.charAt(0).toUpperCase() +
      language.slice(1) +
      '">' +
      match.replace(
        '<figure class="highlight ',
        '<figure class="iseeu highlight '
      ) +
      "</div>";
  });

  // Mark as processed
  data._processedHighlight = true;
  return data;
});

hexo.extend.helper.register("createNewArchivePosts", function (posts) {
  const postList = [],
    postYearList = [];
  posts.forEach((post) => postYearList.push(post.date.year()));
  Array.from(new Set(postYearList)).forEach((year) => {
    postList.push({
      year: year,
      postList: [],
    });
  });
  postList.sort((a, b) => b.year - a.year);
  postList.forEach((item) => {
    posts.forEach(
      (post) => item.year === post.date.year() && item.postList.push(post),
    );
  });
  postList.forEach((item) =>
    item.postList.sort((a, b) => b.date.unix() - a.date.unix()),
  );
  return postList;
});

hexo.extend.helper.register(
  "getAuthorLabel",
  function (postCount, isAuto, labelList) {
    let level = Math.floor(Math.log2(postCount));
    level = level < 2 ? 1 : level - 1;

    if (isAuto === false && Array.isArray(labelList) && labelList.length > 0) {
      return level > labelList.length
        ? labelList[labelList.length - 1]
        : labelList[level - 1];
    } else {
      return `Lv${level}`;
    }
  },
);

hexo.extend.helper.register("getPostUrl", function (rootUrl, path) {
  if (rootUrl) {
    let { href } = new URL(rootUrl);
    if (href.substring(href.length - 1) !== "/") {
      href = href + "/";
    }
    return href + path;
  } else {
    return path;
  }
});

hexo.extend.helper.register("renderJS", function (path, options = {}) {
  const _js = hexo.extend.helper.get("js").bind(hexo);
  const { module = false, async = false, swupReload = false } = options;

  if (Array.isArray(path)) {
    path = path.map((p) => "js/build/" + p);
  } else {
    path = "js/build/" + path;
  }

  const cdnProviders = {
    zstatic:
      "https://s4.zstatic.net/ajax/libs/hexo-theme-redefine/:version/:path",
    cdnjs:
      "https://cdnjs.cloudflare.com/ajax/libs/hexo-theme-redefine/:version/:path",
    unpkg: "https://unpkg.com/hexo-theme-redefine@:version/source/:path",
    jsdelivr:
      "https://cdn.jsdelivr.net/npm/hexo-theme-redefine@:version/source/:path",
    aliyun:
      "https://evan.beee.top/projects/hexo-theme-redefine@:version/source/:path",
    npmmirror:
      "https://registry.npmmirror.com/hexo-theme-redefine/:version/files/source/:path",
    custom: this.theme.cdn.custom_url,
  };

  const cdnPathHandle = (path) => {
    const cdnBase =
      cdnProviders[this.theme.cdn.provider] || cdnProviders.npmmirror;
    let scriptTag;

    const typeAttr = module ? 'type="module"' : "";
    // const asyncAttr = async ? "async" : "";
    const swupAttr = swupReload ? "data-swup-reload-script" : "";

    if (this.theme.cdn.enable) {
      if (this.theme.cdn.provider === "custom") {
        const customUrl = cdnBase
          .replace(":version", themeVersion)
          .replace(":path", path);
        scriptTag = `<script ${typeAttr} src="${
          this.theme.cdn.enable ? customUrl : _js({ src: path })
        }" ${swupAttr}></script>`;
      } else {
        scriptTag = `<script ${typeAttr} src="${cdnBase
          .replace(":version", themeVersion)
          .replace(":path", path)}" ${swupAttr}></script>`;
      }
    } else {
      scriptTag = _js({
        src: path,
        type: module ? "module" : undefined,
        "data-swup-reload-script": swupReload ? "" : undefined,
        // async: async,
      });
    }

    return scriptTag;
  };

  let renderedScripts = "";

  if (Array.isArray(path)) {
    renderedScripts = path.map(cdnPathHandle).join("");
  } else {
    renderedScripts = cdnPathHandle(path);
  }

  return renderedScripts;
});

hexo.extend.helper.register("renderCSS", function (path) {
  const _css = hexo.extend.helper.get("css").bind(hexo);

  const cdnProviders = {
    zstatic:
      "https://s4.zstatic.net/ajax/libs/hexo-theme-redefine/:version/:path",
    cdnjs:
      "https://cdnjs.cloudflare.com/ajax/libs/hexo-theme-redefine/:version/:path",
    unpkg: "https://unpkg.com/hexo-theme-redefine@:version/source/:path",
    jsdelivr:
      "https://cdn.jsdelivr.net/npm/hexo-theme-redefine@:version/source/:path",
    aliyun:
      "https://evan.beee.top/projects/hexo-theme-redefine@:version/source/:path",
    npmmirror:
      "https://registry.npmmirror.com/hexo-theme-redefine/:version/files/source/:path",
    custom: this.theme.cdn.custom_url,
  };

  const cdnPathHandle = (path) => {
    const cdnBase =
      cdnProviders[this.theme.cdn.provider] || cdnProviders.npmmirror;
    let cssLink;

    if (this.theme.cdn.enable) {
      if (this.theme.cdn.provider === "custom") {
        const customUrl = cdnBase
          .replace(":version", themeVersion)
          .replace(":path", path);
        cssLink = `<link rel="stylesheet" href="${customUrl}">`;
      } else {
        cssLink = `<link rel="stylesheet" href="${cdnBase
          .replace(":version", themeVersion)
          .replace(":path", path)}">`;
      }
    } else {
      cssLink = _css(path);
    }

    return cssLink;
  };

  if (Array.isArray(path)) {
    return path.map(cdnPathHandle).join("");
  } else {
    return cdnPathHandle(path);
  }
});

hexo.extend.helper.register("getThemeVersion", function () {
  return themeVersion;
});

hexo.extend.helper.register("checkDeprecation", function (condition, id, message) {
  if (condition) {
    // Use Set to ensure each warning is only logged once per Hexo process
    if (!global.deprecationWarnings) {
      global.deprecationWarnings = new Set();
    }
    
    if (!global.deprecationWarnings.has(id)) {
      hexo.log.warn(`${message}`);
      global.deprecationWarnings.add(id);
    }
    return true;
  }
  return false;
});

hexo.extend.helper.register("configOptions", function (obj, indent = '  ') {
  if (!obj || typeof obj !== 'object') return '';
  
  return Object.entries(obj)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${indent}${key}: '${value}',`;
      }
      return `${indent}${key}: ${value},`;
    })
    .join('\n');
});

/* main hexo */

"use strict";

const url = require("url");
const { version } = require("../../package.json");
const themeVersion = version;

hexo.extend.helper.register("isInHomePaging", function (pagePath, route) {
  if (pagePath.length > 5 && route === "/") {
    return pagePath.slice(0, 5) === "page/";
  } else {
    return false;
  }
});

/* code block language display */
hexo.extend.filter.register("after_post_render", function (data) {
  const pattern = /<figure class="highlight ([a-zA-Z+\-/#]+)">.*?<\/figure>/g;
  data.content = data.content.replace(pattern, function (match, p1) {
    let language = p1 || "code";
    if (language === "plain") {
      language = "code";
    }
    const replaced = match.replace(
      '<figure class="highlight ',
      '<figure class="iseeu highlight ',
    );
    const container =
      '<div class="highlight-container" data-rel="' +
      language.charAt(0).toUpperCase() +
      language.slice(1) +
      '">' +
      replaced +
      "</div>";
    return container;
  });
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

hexo.extend.helper.register("renderJS", function (path) {
  const _js = hexo.extend.helper.get("js").bind(hexo);
  const cdnProviders = {
    sustech: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs",
    baomitu: "https://lib.baomitu.com",    
    zstatic: "https://s4.zstatic.net/ajax/libs",
    cdnjs: "https://cdnjs.cloudflare.com/ajax/libs",
    unpkg: "https://unpkg.com",
    jsdelivr: "https://cdn.jsdelivr.net/npm",
    aliyun: "https://evan.beee.top/projects",
    custom: this.theme.cdn.custom_url,
  };

  const cdnPathHandle = (path) => {
    if (
      this.theme.cdn.provider === ("sustech" || "baomitu" || "zstatic" || "cdnjs") &&
      hexo.locals.get(`cdnTestStatus_${this.theme.cdn.provider}`) !== 200
    ) {
      return _js(path);
    }

    const cdnBase =
      cdnProviders[this.theme.cdn.provider] || cdnProviders.sustech;
    if (this.theme.cdn.provider === "custom") {
      const customUrl = cdnBase
        .replace("${version}", themeVersion)
        .replace("${path}", path);
      return this.theme.cdn.enable
        ? `<script src="${customUrl}"></script>`
        : _js(path);
    } else if (
      this.theme.cdn.provider === "sustech" ||
      this.theme.cdn.provider === "baomitu" ||
      this.theme.cdn.provider === "zstatic" ||
      this.theme.cdn.provider === "cdnjs"
    ) {
      return this.theme.cdn.enable
        ? `<script src="${cdnBase}/hexo-theme-redefine/${themeVersion}/${path}"></script>`
        : _js(path);
    } else {
      return this.theme.cdn.enable
        ? `<script src="${cdnBase}/hexo-theme-redefine@${themeVersion}/source/${path}"></script>`
        : _js(path);
    }
  };

  let t = "";

  if (Array.isArray(path)) {
    for (const p of path) {
      t += cdnPathHandle(p);
    }
  } else {
    t = cdnPathHandle(path);
  }

  return t;
});

hexo.extend.helper.register("renderJSModule", function (path) {
  const _js = hexo.extend.helper.get("js").bind(hexo);
  const cdnProviders = {
    sustech: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs",
    baomitu: "https://lib.baomitu.com",    
    zstatic: "https://s4.zstatic.net/ajax/libs",
    cdnjs: "https://cdnjs.cloudflare.com/ajax/libs",
    unpkg: "https://unpkg.com",
    jsdelivr: "https://cdn.jsdelivr.net/npm",
    aliyun: "https://evan.beee.top/projects",
    custom: this.theme.cdn.custom_url,
  };

  const cdnPathHandle = (path) => {
    if (
      this.theme.cdn.provider === ("sustech" || "baomitu" || "zstatic" || "cdnjs") &&
      hexo.locals.get(`cdnTestStatus_${this.theme.cdn.provider}`) !== 200
    ) {
      return _js({ src: path, type: "module" });
    }

    const cdnBase =
      cdnProviders[this.theme.cdn.provider] || cdnProviders.sustech;
    if (this.theme.cdn.provider === "custom") {
      const customUrl = cdnBase
        .replace("${version}", themeVersion)
        .replace("${path}", path);
      return this.theme.cdn.enable
        ? `<script type="module" src="${customUrl}"></script>`
        : _js({ src: path, type: "module" });
    } else if (
      this.theme.cdn.provider === "sustech" ||
      this.theme.cdn.provider === "baomitu" ||
      this.theme.cdn.provider === "zstatic" ||
      this.theme.cdn.provider === "cdnjs"
    ) {
      return this.theme.cdn.enable
        ? `<script type="module" src="${cdnBase}/hexo-theme-redefine/${themeVersion}/${path}"></script>`
        : _js({ src: path, type: "module" });
    } else {
      return this.theme.cdn.enable
        ? `<script type="module" src="${cdnBase}/hexo-theme-redefine@${themeVersion}/source/${path}"></script>`
        : _js({ src: path, type: "module" });
    }
  };

  let t = "";

  if (Array.isArray(path)) {
    for (const p of path) {
      t += cdnPathHandle(p);
    }
  } else {
    t = cdnPathHandle(path);
  }

  return t;
});

hexo.extend.helper.register("renderJSPath", function (path) {
  const _url_for = hexo.extend.helper.get("url_for").bind(hexo);
  const cdnProviders = {
    sustech: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs",
    baomitu: "https://lib.baomitu.com",    
    zstatic: "https://s4.zstatic.net/ajax/libs",
    cdnjs: "https://cdnjs.cloudflare.com/ajax/libs",
    unpkg: "https://unpkg.com",
    jsdelivr: "https://cdn.jsdelivr.net/npm",
    aliyun: "https://evan.beee.top/projects",
    custom: this.theme.cdn.custom_url,
  };

  const cdnPathHandle = (path) => {
    if (
      this.theme.cdn.provider === ("sustech" || "baomitu" || "zstatic" || "cdnjs") &&
      hexo.locals.get(`cdnTestStatus_${this.theme.cdn.provider}`) !== 200
    ) {
      return _url_for(path);
    }

    const cdnBase =
      cdnProviders[this.theme.cdn.provider] || cdnProviders.sustech;
    if (this.theme.cdn.provider === "custom") {
      const customUrl = cdnBase
        .replace("${version}", themeVersion)
        .replace("${path}", path);
      return this.theme.cdn.enable ? customUrl : _url_for(path);
    } else if (
      this.theme.cdn.provider === "sustech" ||
      this.theme.cdn.provider === "baomitu" ||
      this.theme.cdn.provider === "zstatic" ||
      this.theme.cdn.provider === "cdnjs"
    ) {
      return this.theme.cdn.enable
        ? `${cdnBase}/hexo-theme-redefine/${themeVersion}/${path}`
        : _url_for(path);
    } else {
      return this.theme.cdn.enable
        ? `${cdnBase}/hexo-theme-redefine@${themeVersion}/source/${path}`
        : _url_for(path);
    }
  };

  let t = "";

  if (Array.isArray(path)) {
    for (const p of path) {
      t += cdnPathHandle(p);
    }
  } else {
    t = cdnPathHandle(path);
  }

  return t;
});

hexo.extend.helper.register("renderCSS", function (path) {
  const _css = hexo.extend.helper.get("css").bind(hexo);
  const cdnProviders = {
    sustech: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs",
    baomitu: "https://lib.baomitu.com",    
    zstatic: "https://s4.zstatic.net/ajax/libs",
    cdnjs: "https://cdnjs.cloudflare.com/ajax/libs",
    unpkg: "https://unpkg.com",
    jsdelivr: "https://cdn.jsdelivr.net/npm",
    aliyun: "https://evan.beee.top/projects",
    custom: this.theme.cdn.custom_url,
  };

  const cdnPathHandle = (path) => {
    if (
      this.theme.cdn.provider === ("sustech" || "baomitu" || "zstatic" || "cdnjs") &&
      hexo.locals.get(`cdnTestStatus_${this.theme.cdn.provider}`) !== 200
    ) {
      return _css(path);
    }

    const cdnBase =
      cdnProviders[this.theme.cdn.provider] || cdnProviders.sustech;
    if (this.theme.cdn.provider === "custom") {
      const customUrl = cdnBase
        .replace("${version}", themeVersion)
        .replace("${path}", path);
      return this.theme.cdn.enable
        ? `<link rel="stylesheet" href="${customUrl}">`
        : _css(path);
    } else if (
      this.theme.cdn.provider === "sustech" ||
      this.theme.cdn.provider === "baomitu" ||
      this.theme.cdn.provider === "zstatic" ||
      this.theme.cdn.provider === "cdnjs"
    ) {
      return this.theme.cdn.enable
        ? `<link rel="stylesheet" href="${cdnBase}/hexo-theme-redefine/${themeVersion}/${path}">`
        : _css(path);
    } else {
      return this.theme.cdn.enable
        ? `<link rel="stylesheet" href="${cdnBase}/hexo-theme-redefine@${themeVersion}/source/${path}">`
        : _css(path);
    }
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

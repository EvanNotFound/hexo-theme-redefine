hexo.extend.helper.register('generateMeta', function (theme, page) {
  const hexo = this;
  let robots_content="";
  if (page.robots) {
    robots_content = page.robots
  } else if (theme.seo && theme.seo.robots) {
    if (hexo.is_home()) {
      if (page.prev == 0) {
        robots_content=theme.seo.robots.home_first_page
      }else{
        robots_content=theme.seo.robots.home_other_pages
      }
    } else if (hexo.is_archive()) {
      robots_content=theme.seo.robots.archive
    } else if (hexo.is_category()) {
      robots_content=theme.seo.robots.category
    } else if (hexo.is_tag()) {
      robots_content=theme.seo.robots.tag
    }
  }
  if(robots_content){
    return `<meta name="robots" content="${robots_content}">`
  }
});

/**
* hexo-auto-canonical
* https://github.com/hyunseob/hexo-auto-canonical.git
* Copyright (c) 2015, HyunSeob
* Licensed under the MIT license.
*/

hexo.extend.helper.register('autoCanonical', function (config, page) {
  var base_url = config.url;
  if (config.url.charAt(config.url.length - 1) !== '/') base_url += '/';

  return '<link rel="canonical" href="' + base_url + page.canonical_path.replace('index.html', '').toLowerCase() + '"/>';
});
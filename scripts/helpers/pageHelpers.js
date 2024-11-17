const pageData = {
	home: {
		titles: ["home", "Home", "首页"],
		types: ["home"],
		themeKey: "home",
		partial: "_partials/home-content",
        layout: "raw"
	},
	archive: {
		titles: ["archive", "archives", "归档", "Archives", "Archive"],
		types: ["archive", "archives"],
		themeKey: "archives",
		partial: "archive-content",
		layout: "raw",
	},
	post: {
		titles: ["post", "posts", "文章", "Post", "Posts"],
		types: ["post", "posts"],
		themeKey: "posts",
		partial: "article-content",
		layout: "raw",
	},
	category: {
		titles: ["category", "categories", "分类", "Categories", "Category"],
		types: ["category", "categories"],
		themeKey: "categories",
		partial: "category-list",
		layout: "default",
	},
	tag: {
		titles: ["tag", "tags", "标签", "Tags", "Tag"],
		types: ["tag", "tags"],
		themeKey: "tags",
		partial: "_widgets/tagcloud",
		layout: "default",
	},
	notFound: {
		titles: ["Page Not Found", "404", "未找到页面"],
		types: ["404", "notfound"],
		themeKey: "404",
		partial: "_partials/404-template",
		layout: "raw",
	},
	friends: {
		titles: [
			"friends",
			"friend",
			"友情链接",
			"友情鏈接",
			"友情鏈結",
			"朋友",
			"朋友們",
			"朋友们",
			"links",
			"link",
			"Link",
			"Links",
		],
		types: ["links", "link"],
		themeKey: "links",
		partial: "_widgets/friends-link",
		layout: "default",
	},
	shuoshuo: {
		titles: ["essays", "essay", "shuoshuo", "说说", "即刻短文", "Shuoshuo"],
		types: ["essays", "essay", "shuoshuo"],
		themeKey: ["essays", "shuoshuo"],
		partial: "_widgets/essays",
		layout: "default",
	},
	masonry: {
		titles: [
			"masonry",
			"gallery",
			"Masonry",
			"Gallery",
			"照片墙",
			"照片牆",
			"相册",
			"相冊",
			"瀑布流",
			"photos",
			"Photos",
			"photo",
			"Photo",
		],
		types: ["masonry", "gallery", "瀑布流", "相册", "photos", "photo"],
		themeKey: ["masonry", "gallery", "photos"],
		partial: "_widgets/masonry",
		layout: "default",
	},
	pageTemplate: {
		titles: [],
		types: [],
		themeKey: "page",
		partial: "_partials/page-template",
		layout: "default",
	},
};

hexo.extend.helper.register("getPageData", function () {
	return pageData;
});

hexo.extend.helper.register("getPagePartialPath", function (page) {
	const matchesPageType = (type) => {
		const config = pageData[type];
		return (
			config.types.includes(page.type) || config.titles.includes(page.title)
		);
	};

	// Check built-in page types first
	if (this.is_home()) return pageData.home.partial;
	if (this.is_archive()) return pageData.archive.partial;
	if (this.is_post()) return pageData.post.partial;
	if (this.is_category()) return pageData.category.partial;
	if (this.is_tag()) return pageData.tag.partial;

	// Check custom page types
	for (const [type, config] of Object.entries(pageData)) {
		if (matchesPageType(type) && config.layout === 'raw') {
			return config.partial;
		}
	}

	return pageData.pageTemplate.partial;
});

hexo.extend.helper.register('getPageTitle', function(page) {
  const pageData = this.getPageData();
  
  let type = null;

  // Determine the type based on page properties
  if (this.is_home()) type = 'home';
  else if (this.is_archive()) type = 'archive';
  else if (this.is_post()) type = 'post';
  else if (this.is_category()) type = 'category';
  else if (this.is_tag()) type = 'tag';
  else {
    // Iterate through custom page types
    for (const [key, config] of Object.entries(pageData)) {
      if (config.types.includes(page.type) || config.titles.includes(page.title)) {
        type = key;
        break;
      }
    }
  }

  const config = type ? pageData[type] : null;
  
  if (!config) return page.title || 'Untitled';

  const hasCustomTitle = page.title && 
    !config.titles.map(title => title.toLowerCase()).includes(page.title.toLowerCase());

  return hasCustomTitle ? page.title : this.__(type);
});

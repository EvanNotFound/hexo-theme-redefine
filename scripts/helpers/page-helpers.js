/*
	pageData is an object that defines various page types and their associated rendering details.
	
	Each page type includes the following properties:
	
	- titles: An array of possible titles for the page, which are used to identify the page type.
	- types: An array of page types that can be matched; the type takes precedence over the title for identification.
	- partial: The path to the partial template that will be used to render the content of the page.
	- layout: Specifies the layout style for the page. "raw" indicates that no theme layout will be applied, while "default" means the standard theme layout (container) will be used.
*/

const pageData = {
	home: {
		titles: ["home", "首页"],
		types: ["home"],
		partial: "pages/home/home-content",
		layout: "raw",
	},
	archive: {
		titles: ["archive", "归档"],
		types: ["archive", "archives"],
		partial: "pages/archive/archive",
		layout: "raw",
	},
	post: {
		titles: ["post", "文章"],
		types: ["post", "posts"],
		partial: "pages/post/article-content",
		layout: "raw",
	},
	categories: {
		titles: ["category", "categories"],
		types: ["category", "categories"],
		partial: "pages/category/categories",
		layout: "default",
	},
	categoryDetail: {
		titles: [],
		types: [],
		partial: "pages/category/category-detail",
		layout: "default",
	},
	tags: {
		titles: ["tag", "tags"],
		types: ["tag", "tags"],
		partial: "pages/tag/tags",
		layout: "default",
	},
	tagDetail: {
		titles: [],
		types: [],
		partial: "pages/tag/tag-detail",
		layout: "default",
	},
	notFound: {
		titles: ["404", "notfound"],
		types: ["404", "notfound"],
		partial: "pages/notfound/notfound",
		layout: "raw",
	},
	friends: {
		titles: ["friends", "links", "link", "friend", "友情链接"],
		types: ["links", "link"],
		partial: "pages/friends/friends-link",
		layout: "default",
	},
	shuoshuo: {
		titles: ["shuoshuo", "说说"],
		types: ["essays", "essay", "shuoshuo"],
		partial: "pages/shuoshuo/essays",
		layout: "default",
	},
	masonry: {
		titles: ["gallery", "瀑布流", "相册", "photos", "photo"],
		types: ["masonry", "gallery", "瀑布流", "相册", "photos", "photo"],
		partial: "pages/masonry/masonry",
		layout: "default",
	},
	bookmarks: {
		titles: [],
		types: ["bookmarks", "bookmark", "tools"],
		partial: "pages/bookmarks/bookmarks",
		layout: "raw",
	},
	pageTemplate: {
		titles: [],
		types: [],
		partial: "pages/page-template",
		layout: "default",
	},
};

hexo.extend.helper.register("getAllPageData", function () {
	return pageData;
});

hexo.extend.helper.register("getPageData", function (page) {
	if (this.is_home()) return pageData.home;
	if (this.is_archive()) return pageData.archive;
	if (this.is_post()) return pageData.post;
	if (this.is_category()) return pageData.categoryDetail;
	if (this.is_tag()) return pageData.tagDetail;

	const currentPageConfig = Object.entries(pageData).find(([type, config]) => {
		return config.types.includes(page.template || page.type) || config.titles.includes(page.title?.toLowerCase());
	});
	return currentPageConfig ? pageData[currentPageConfig[0]] : null;
});

hexo.extend.helper.register("getPagePartialPath", function (page) {
	const matchesPageType = (type) => {
		const config = pageData[type];
		return (
			config.types.includes(page.template || page.type) ||
			config.titles.includes(page.title?.toLowerCase())
		);
	};

	// Check built-in page types first
	if (this.is_home()) return pageData.home.partial;

	if (this.is_post()) return pageData.post.partial;
	// Check custom page types
	for (const [type, config] of Object.entries(pageData)) {
		if (matchesPageType(type) && config.layout === "raw") {
			return config.partial;
		} else if (this.is_archive() && pageData.archive.layout === "raw") { // return raw layout for archive page
			return pageData.archive.partial;
		} else if (this.is_category() && pageData.categoryDetail.layout === "raw") { // return raw layout for category page
			return pageData.categoryDetail.partial;
		} else if (this.is_tag() && pageData.tagDetail.layout === "raw") { // return raw layout for tag page
			return pageData.tagDetail.partial;
		}
	}

	return pageData.pageTemplate.partial;
});

hexo.extend.helper.register("getPageTitle", function (page) {
	const pageData = this.getPageData(page);
	let type = null;

	// Determine the type based on page properties
	if (this.is_home()) type = "home";
	else if (this.is_archive()) type = "archive";
	else if (this.is_post()) type = "post";
	else {
		type = pageData.type;
	}

	// const config = type ? pageData[type] : null;
	return page.title || this.__(type) || "Untitled";
});

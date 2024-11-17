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
		types: ["home"],
		partial: "pages/home/home-content",
		layout: "raw"
	},
	archive: {
		types: ["archive", "archives"],
		partial: "pages/archive/archive-content",
		layout: "raw",
	},
	post: {
		types: ["post", "posts"],
		partial: "pages/post/article-content",
		layout: "raw",
	},
	category: {
		types: ["category", "categories"],
		partial: "pages/category/category-list",
		layout: "default",
	},
	tag: {
		types: ["tag", "tags"],
		partial: "pages/tag/tagcloud",
		layout: "default",
	},
	notFound: {
		types: ["404", "notfound"],
		partial: "pages/404/404-template",
		layout: "raw",
	},
	friends: {
		types: ["links", "link"],
		partial: "pages/friends/friends-link",
		layout: "default",
	},
	shuoshuo: {
		types: ["essays", "essay", "shuoshuo"],
		partial: "pages/shuoshuo/essays",
		layout: "default",
	},
	masonry: {
		types: ["masonry", "gallery", "瀑布流", "相册", "photos", "photo"],
		partial: "pages/masonry/masonry",
		layout: "default",
	},
	pageTemplate: {
		types: [],
		partial: "pages/page-template",
		layout: "default",
	},
};

hexo.extend.helper.register("getPageData", function () {
	return pageData;
});

hexo.extend.helper.register("getPagePartialPath", function (page) {
	const matchesPageType = (type) => {
		const config = pageData[type];
		return config.types.includes(page.template || page.type);
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
			if (config.types.includes(page.template || page.type)) {
				type = key;
				break;
			}
		}
	}

	const config = type ? pageData[type] : null;
	return page.title || this.__(type) || 'Untitled';
});

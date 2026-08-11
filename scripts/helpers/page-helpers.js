"use strict";

const customPageKinds = new Map([
	["categories", "categories"],
	["tags", "tags"],
	["links", "friends"],
	["masonry", "masonry"],
	["bookmarks", "bookmarks"],
	["essays", "essays"],
]);

hexo.extend.helper.register("resolvePageKind", function (page) {
	if (this.is_home()) return "home";
	if (this.is_post()) return "post";
	if (this.is_archive()) return "archive";
	if (this.is_category()) return "category";
	if (this.is_tag()) return "tag";

	return customPageKinds.get(page?.template) || "page";
});

"use strict";

const customPageKinds = new Map([
	["categories", "categories"],
	["tags", "tags"],
	["links", "friends"],
	["masonry", "masonry"],
	["bookmarks", "bookmarks"],
	["essays", "essays"],
]);

hexo.extend.helper.register("getCategoryTree", function (categories) {
	const items = [];
	categories?.forEach((category) => items.push(category));

	const nodes = items
		.map((category) => ({
			id: String(category._id),
			parentId: category.parent ? String(category.parent) : null,
			name: category.name,
			path: category.path,
			count: category.length,
			children: [],
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
	const nodesById = new Map(nodes.map((node) => [node.id, node]));
	const roots = [];

	nodes.forEach((node) => {
		const parent = node.parentId && nodesById.get(node.parentId);
		(parent ? parent.children : roots).push(node);
	});

	let controlIndex = 0;
	const assignControlIds = (categories) => {
		categories.forEach((category) => {
			category.controlId = `category-children-${controlIndex++}`;
			assignControlIds(category.children);
		});
	};
	assignControlIds(roots);

	return roots;
});

hexo.extend.helper.register("resolvePageKind", function (page) {
	if (this.is_home()) return "home";
	if (this.is_post()) return "post";
	if (this.is_archive()) return "archive";
	if (this.is_category()) return "category";
	if (this.is_tag()) return "tag";

	return customPageKinds.get(page?.template) || "page";
});

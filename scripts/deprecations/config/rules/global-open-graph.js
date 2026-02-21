"use strict";

const ID = "global.open_graph.boolean";
const MESSAGE =
  "Config deprecation: `global.open_graph: true/false` is deprecated; use object format instead:\n" +
  "global:\n" +
  "  open_graph:\n" +
  "    enable: true\n" +
  "    image: your_image_path\n" +
  "    description: your_description";

const detect = (themeConfig) => {
  return typeof themeConfig?.global?.open_graph === "boolean";
};

const apply = (themeConfig) => {
  const openGraph = themeConfig?.global?.open_graph;
  if (typeof openGraph !== "boolean") {
    return { changed: false };
  }

  if (!themeConfig.global || typeof themeConfig.global !== "object" || Array.isArray(themeConfig.global)) {
    themeConfig.global = {};
  }

  themeConfig.global.open_graph = {
    enable: openGraph,
  };

  return { changed: true };
};

module.exports = {
  id: ID,
  message: MESSAGE,
  detect,
  apply,
};

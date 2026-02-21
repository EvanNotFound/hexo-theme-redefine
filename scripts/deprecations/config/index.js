"use strict";

const { warnOnce } = require("../warn");
const globalOpenGraph = require("./rules/global-open-graph");
const homeBannerSocialLinks = require("./rules/home-banner-social-links");

const RULES = [globalOpenGraph, homeBannerSocialLinks];

const applyConfigDeprecations = ({ hexo, themeConfig }) => {
  if (!themeConfig) {
    return;
  }

  RULES.forEach((rule) => {
    if (!rule || typeof rule.detect !== "function" || typeof rule.apply !== "function") {
      return;
    }

    if (!rule.detect(themeConfig)) {
      return;
    }

    const result = rule.apply(themeConfig) || {};
    if (result.changed) {
      warnOnce({
        hexo,
        id: rule.id,
        message: rule.message,
      });
    }
  });
};

module.exports = {
  applyConfigDeprecations,
};

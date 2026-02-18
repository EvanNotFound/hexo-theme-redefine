"use strict";

const { ensurePrefix } = require("../utils/log-prefix");

const warned = new Set();

const warnOnce = ({ hexo, id, message }) => {
  if (!hexo || !hexo.log || typeof hexo.log.warn !== "function") {
    return;
  }

  if (warned.has(id)) {
    return;
  }

  warned.add(id);
  hexo.log.warn(ensurePrefix(message));
};

module.exports = {
  warnOnce,
};

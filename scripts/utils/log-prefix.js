"use strict";

const PREFIX = "[redefine] ";

const ensurePrefix = (message) => {
  if (typeof message !== "string") {
    return message;
  }

  if (message.startsWith(PREFIX)) {
    return message;
  }

  return `${PREFIX}${message}`;
};

module.exports = {
  PREFIX,
  ensurePrefix,
};

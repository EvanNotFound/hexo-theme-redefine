"use strict";

const isPlainObject = (value) => {
  return value && typeof value === "object" && !Array.isArray(value);
};

const hasValue = (value) => {
  return value !== undefined && value !== null && value !== "";
};

module.exports = {
  isPlainObject,
  hasValue,
};

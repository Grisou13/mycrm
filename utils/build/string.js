"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prefixObject = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var prefixObject = function prefixObject(obj, prefix) {
  return Object.keys(obj).reduce(function (acc, key) {
    Object.assign(acc, _defineProperty({}, key, "@".concat(prefix, "/").concat(obj[key])));
    return acc;
  }, {});
};

exports.prefixObject = prefixObject;
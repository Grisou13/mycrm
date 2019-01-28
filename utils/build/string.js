"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var prefixObject = exports.prefixObject = function prefixObject(obj, prefix) {
    return Object.keys(obj).reduce(function (acc, key) {

        Object.assign(acc, _defineProperty({}, key, "@" + prefix + "/" + obj[key]));
        return acc;
    }, {});
};
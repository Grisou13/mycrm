'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('utils');

var _utils2 = _interopRequireDefault(_utils);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _utils2.default.string.prefixObject(_events2.default, 'auth');
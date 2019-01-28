'use strict';

var _AuthListener = require('./AuthListener');

var _AuthListener2 = _interopRequireDefault(_AuthListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();
var deepstream = require('deepstream.io-client-js');

//const AuthService = require("./AuthService");


var client = deepstream(process.env.DEEPSTREAM_HOST);
client.login(null);

var service = new _AuthListener2.default(client);
service.run();
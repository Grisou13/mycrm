'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _auth = require('auth.events');

var _auth2 = _interopRequireDefault(_auth);

var _utils = require('utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthService = function () {
    function AuthService(client) {
        _classCallCheck(this, AuthService);

        this.client = client;
    }

    _createClass(AuthService, [{
        key: 'reportError',
        value: function reportError(error) {
            console.log("error", error);
        }
    }, {
        key: 'rpcResponseHandler',
        value: function rpcResponseHandler(cb) {
            var _this = this;

            return function (err, res) {
                if (err) _this.reportError(err);
                console.log("Received response %s", res);
                if (cb) cb(res);
            };
        }
    }, {
        key: 'createUser',
        value: function createUser(credentials, cb) {
            this.run(_auth2.default.CREATE_USER, credentials, this.rpcResponseHandler(cb));
        }
    }, {
        key: 'login',
        value: function login(credentials, cb) {
            this.run(_auth2.default.AUTH_USER, credentials, this.rpcResponseHandler(cb));
        }
    }, {
        key: 'close',
        value: function close() {
            this.client.close();
        }
    }, {
        key: 'run',
        value: function run(event, data, cb) {
            this.client.rpc.make(event, data, cb);
        }
    }]);

    return AuthService;
}();

exports.default = AuthService;
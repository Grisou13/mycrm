'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _auth = require('auth.events');

var _auth2 = _interopRequireDefault(_auth);

var _auth3 = require('./auth');

var _utils = require('utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthListener = function () {
    function AuthListener(client) {
        _classCallCheck(this, AuthListener);

        console.log(_utils2.default.rpc);
        this.rpcClient = new _utils2.default.rpc.RpcListener(client);
    }

    _createClass(AuthListener, [{
        key: 'attachCallbacks',
        value: function attachCallbacks(listener) {
            var _this = this;

            this.registerCallback(listener, _auth2.default.AUTH_USER, function (data, response) {
                _this.auth.login(data, function (token) {
                    response.send({
                        token: token
                    });
                }, function (err) {
                    response.send({
                        error: err
                    });
                });
            });

            this.registerCallback(listener, _auth2.default.GENERATE_TOKEN, function (data, response) {
                _this.auth.generateToken(data, function (token) {
                    response.send({
                        token: token
                    });
                });
            });
            this.registerCallback(listener, _auth2.default.VALIDATE_TOKEN, function (data, response) {
                _this.auth.validate(data, function (res) {
                    response.send({
                        validity: res
                    });
                });
            });
            this.registerCallback(listener, _auth2.default.DESTROY_TOKEN, function (data, response) {
                _this.auth.unvalidate(data, function (res) {
                    response.send({
                        done: res
                    });
                });
            });

            this.registerCallback(listener, _auth2.default.CREATE_USER, function (data, response) {
                _this.auth.signup(data, function (userId) {
                    response.send({
                        userId: userId
                    });
                });
            });
        }
    }, {
        key: 'registerCallback',
        value: function registerCallback(listener, name, cb) {
            listener.apply(name, function (request, response) {
                cb(request.body, response);
            });
        }
    }, {
        key: 'run',
        value: function run() {
            var _this2 = this;

            _auth3.MongoDbDriver.connect(function (dbClient, db) {
                _this2.driver = new _auth3.MongoDbDriver(dbClient, db);
                _this2.auth = new _auth3.Auth(_this2.driver);
                _this2.attachCallbacks(_this2.rpcClient);
            });
        }
    }]);

    return AuthListener;
}();

exports.default = AuthListener;
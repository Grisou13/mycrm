"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _auth = _interopRequireDefault(require("auth.events"));

var _Auth = _interopRequireDefault(require("./Auth"));

var _MongoDbDriver = _interopRequireDefault(require("./MongoDbDriver"));

var _utils = _interopRequireDefault(require("utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthListener =
/*#__PURE__*/
function () {
  function AuthListener(client, driver) {
    _classCallCheck(this, AuthListener);

    this.rpcClient = new _utils.default.rpc.RpcListener(client);
    this.driver = driver;
    this.auth = new _Auth.default(this.driver);
    this.attachCallbacks(this.rpcClient);
  }

  _createClass(AuthListener, [{
    key: "attachCallbacks",
    value: function attachCallbacks(listener) {
      var _this = this;

      this.registerCallback(listener, _auth.default.AUTH_USER, function (data, response) {
        _this.auth.login(data).then(function (token) {
          response.send({
            token: token
          });
        }).catch(function (err) {
          response.send({
            error: err
          });
        });
      });
      this.registerCallback(listener, _auth.default.GENERATE_TOKEN, function (data, response) {
        var _this$auth;

        (_this$auth = _this.auth).generateToken.apply(_this$auth, _toConsumableArray(data)).then(function (token) {
          response.send({
            token: token
          });
        });
      });
      this.registerCallback(listener, _auth.default.VALIDATE_TOKEN, function (data, response) {
        _this.auth.validate(data).then(function (res) {
          response.send({
            validity: res
          });
        });
      });
      this.registerCallback(listener, _auth.default.DESTROY_TOKEN, function (data, response) {
        _this.auth.unvalidate(data).then(function (res) {
          response.send({
            done: res
          });
        });
      });
      this.registerCallback(listener, _auth.default.CREATE_USER, function (data, response) {
        _this.auth.signup(data).then(function (user) {
          response.send({
            userId: user._id
          });
        });
      });
    }
  }, {
    key: "registerCallback",
    value: function registerCallback(listener, name, cb) {
      listener.apply(name, function (ctx) {
        console.log(ctx.request);
        cb(ctx.request.body, ctx.res);
      });
    }
  }, {
    key: "run",
    value: function run() {
      this.rpcClient.run();
    }
  }, {
    key: "close",
    value: function close() {
      this.rpcClient.close();
      this.driver.close();
    }
  }]);

  return AuthListener;
}();

exports.default = AuthListener;
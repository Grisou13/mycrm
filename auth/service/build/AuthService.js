"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _auth = _interopRequireDefault(require("auth.events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthService =
/*#__PURE__*/
function () {
  function AuthService(client) {
    _classCallCheck(this, AuthService);

    this.client = client;
  }

  _createClass(AuthService, [{
    key: "reportError",
    value: function reportError(error) {
      console.log("error", error);
    }
    /**
     * 
     * @param {Object} credentials
     * @return Promise with a valid user
     */

  }, {
    key: "createUser",
    value: function createUser(credentials) {
      return this._run(_auth.default.CREATE_USER, credentials);
    }
    /**
     * 
     * @param {Object} credentials 
     * @return Promise promise with a valid token
     */

  }, {
    key: "login",
    value: function login(credentials) {
      return this._run(_auth.default.AUTH_USER, credentials);
    }
  }, {
    key: "close",
    value: function close() {
      return this.client.close();
    }
  }, {
    key: "_run",
    value: function _run(event, data) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.client.rpc.make(event, data, function (err, res) {
          if (err) reject(err);
          console.log("Received response %s", res);
          resolve(res);
        });
      });
    }
  }]);

  return AuthService;
}();

exports.default = AuthService;
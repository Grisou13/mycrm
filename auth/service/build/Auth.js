"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

var Auth =
/*#__PURE__*/
function () {
  function Auth(driver) {
    _classCallCheck(this, Auth);

    this.driver = driver;
  }

  _createClass(Auth, [{
    key: "fetchCert",
    value: function fetchCert() {
      return fs.readFileSync('private.key');
    }
    /**
     * Generate a jwt token identified by data passed in arguments
     * @param {Object} data { userId: required, }
     */

  }, {
    key: "generateToken",
    value: function generateToken(data) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        try {
          // sign with RSA SHA256
          var exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

          var cert = _this.fetchCert();

          var token = _jsonwebtoken.default.sign(_objectSpread({
            exp: exp
          }, data), cert, {
            algorithm: 'RS256'
          });

          _this.driver.logToken(data.user_id, token);

          resolve(token);
        } catch (err) {
          reject(err);
        }
      });
    }
    /**
     * 
     * @param {Object} credentials {identifier: string, password: string}
     */

  }, {
    key: "login",
    value: function login(credentials) {
      var _this2 = this;

      return this.driver.checkUserExists(credentials.identifier).then(function (found) {
        if (!found) {
          throw new Error("User not found");
        }

        return _this2.driver.fetchUser(credentials);
      }).then(function (user) {
        if (user) return _this2.generateToken(user._id);
        throw new Error("username and password wrong");
      });
    }
  }, {
    key: "signup",
    value: function signup(credentials) {
      var _this3 = this;

      return this.driver.checkUserExists(credentials.email).then(function (found) {
        if (!found) {
          throw new Error("User already exists");
        }

        return _this3.driver.createUser(credentials);
      });
    }
  }, {
    key: "unvalidate",
    value: function unvalidate(token) {
      return this.driver.resignToken(token);
    }
  }, {
    key: "verifyToken",
    value: function verifyToken(token) {
      var _this4 = this;

      this.driver.checkIfTokenExists(token).then(function (found) {
        if (found) {
          var cert = _this4.fetchCert();

          return _jsonwebtoken.default.verify(token, cert);
        }

        return false;
      });
    }
  }]);

  return Auth;
}();

exports.default = Auth;
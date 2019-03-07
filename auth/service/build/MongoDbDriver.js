"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongodb = require("mongodb");

var _User = _interopRequireDefault(require("./models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MongoDbDriver =
/*#__PURE__*/
function () {
  function MongoDbDriver(client, db) {
    _classCallCheck(this, MongoDbDriver);

    this.db = db;
    this.client = client;
  }

  _createClass(MongoDbDriver, [{
    key: "close",
    value: function close() {
      return this.client.close();
    }
  }, {
    key: "fetchUser",
    value: function fetchUser(credentials) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.db.collection("users").findOne({
          "password": _this._encodePassword(credentials.password),
          $or: [{
            "email": credentials.identifier
          }, {
            "username": credentials.identifier
          }]
        }, function (err, r) {
          if (err) reject(err);
          resolve(_User.default.build(r));
        });
      });
    }
  }, {
    key: "checkUserExists",
    value: function checkUserExists(identifier) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.db.collection("users").findOne({
          $or: [{
            "email": identifier
          }, {
            "username": identifier
          }]
        }, function (err, r) {
          if (err) return reject(err);
          if (r) resolve(true);
          resolve(false);
        });
      });
    }
  }, {
    key: "logToken",
    value: function logToken(userId, token) {
      this.db.collection("tokens").insertOne({
        userId: userId,
        token: token
      });
    }
  }, {
    key: "resignToken",
    value: function resignToken(token) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var res = _this3.db.collection("tokens").remove({
          "token": token
        }, {
          justOne: true
        });

        if (res.nRemoved <= 1) {
          resolve(token);
        } else {
          reject(res);
        }
      });
    }
  }, {
    key: "checkIfTokenExists",
    value: function checkIfTokenExists(token) {
      var _this4 = this;

      return new Promise(function (reject, resolve) {
        _this4.db.collection("tokens").findOne({
          token: token
        }, function (err, r) {
          if (err) return reject(err);
          if (r) return resolve(true);
          return resolve(false);
        });
      });
    }
  }, {
    key: "createUser",
    value: function createUser(data) {
      var _this5 = this;

      return new Promise(function (reject, resolve) {
        var newUser = {
          user_id: data.user_id || null,
          username: data.username,
          email: data.email,
          password: _this5._encodePassword(data.password)
        };

        _this5.db.collection("users").insertOne(newUser, function (err, r) {
          if (err) reject(err);
          resolve(_User.default.build(r.ops[0]));
        });
      });
    }
  }, {
    key: "_encodePassword",
    value: function _encodePassword(pwd) {
      return pwd;
    }
  }], [{
    key: "connect",
    value: function connect(cb) {
      // Connection URL
      var url = process.env.DB_URL; // Database Name

      var dbName = process.env.DB_NAME; // Create a new MongoClient

      var client = new _mongodb.MongoClient(url); // Use connect method to connect to the Server

      client.connect(function (err) {
        var db = client.db(dbName);
        cb(client, db);
      });
    }
  }]);

  return MongoDbDriver;
}();

exports.default = MongoDbDriver;
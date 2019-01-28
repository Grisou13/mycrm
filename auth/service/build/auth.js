'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MongoDbDriver = exports.Auth = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongodb = require('mongodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');

var Auth = exports.Auth = function () {
    function Auth(driver) {
        _classCallCheck(this, Auth);

        this.driver = driver;
    }

    _createClass(Auth, [{
        key: 'fetchCert',
        value: function fetchCert() {
            return fs.readFileSync('private.key');
        }
    }, {
        key: 'generateToken',
        value: function generateToken(userId, cb) {

            // sign with RSA SHA256
            var exp = Math.floor(Date.now() / 1000) + 60 * 60;
            var cert = fs.readFileSync('private.key');
            var token = _jsonwebtoken2.default.sign({ userId: userId, exp: exp }, cert, { algorithm: 'RS256' });
            this.driver.logToken(userId, token);
            cb(token);
            return true;
        }
    }, {
        key: 'login',
        value: function login(credentials, cb, cbErr) {
            var _this = this;

            this.driver.checkUserExists(credentials.identifier, function (found) {
                if (!found) {
                    return cbErr("User not found");
                }
                _this.driver.checkCredentials(credentials, function (user) {
                    if (user) return _this.generateToken(user._id, cb);
                    cbErr("username and password wrong");
                });
            });
        }
    }, {
        key: 'signup',
        value: function signup(credentials, cb) {
            if (!this.driver.checkUserExists(credentials.email)) {
                return false;
            }
            this.driver.createUser(credentials, cb);
            return true;
        }
    }, {
        key: 'unvalidate',
        value: function unvalidate(token, cb) {
            cb(this.driver.resignToken(token));
        }
    }, {
        key: 'verifyToken',
        value: function verifyToken(token, cb) {
            var _this2 = this;

            this.driver.checkIfTokenExists(token, function (found) {
                if (found) {
                    var cert = _this2.fetchCert();
                    cb(_jsonwebtoken2.default.verify(token, cert));
                }
                cb(false);
            });
        }
    }]);

    return Auth;
}();

var MongoDbDriver = exports.MongoDbDriver = function () {
    function MongoDbDriver(client, db) {
        _classCallCheck(this, MongoDbDriver);

        this.db = db;
        this.client = client;
    }

    _createClass(MongoDbDriver, [{
        key: 'fetchUser',
        value: function fetchUser(credentials, cb) {
            this.db.collection("users").findOne({
                "password": this._encodePassword(credentials.password),
                $or: [{ "email": credentials.identifier }, { "username": credentials.identifier }]
            }, function (err, r) {
                cb(r);
            });
        }
    }, {
        key: 'checkUserExists',
        value: function checkUserExists(identifier, cb) {
            this.db.collection("users").findOne({ $or: [{ "email": identifier }, { "username": identifier }] }, function (err, r) {
                if (!err && r) return cb(true);
                cb(false);
            });
        }
    }, {
        key: 'checkCredentials',
        value: function checkCredentials(credentials, cb) {
            this.fetchUser(credentials, function (user) {
                cb(user);
            });
        }
    }, {
        key: 'logToken',
        value: function logToken(userId, token) {
            this.db.collection("tokens").insertOne({
                userId: userId,
                token: token
            });
        }
    }, {
        key: 'resignToken',
        value: function resignToken(token) {
            var res = this.db.collection("tokens").remove({
                "token": token
            }, {
                justOne: true
            });
            return res.nRemoved > 0;
        }
    }, {
        key: 'checkIfTokenExists',
        value: function checkIfTokenExists(token, cb) {
            this.db.collection("tokens").findOne({ token: token }, function (err, r) {
                if (r) return cb(true);

                return cb(false);
            });
        }
    }, {
        key: 'createUser',
        value: function createUser(data, cb) {
            var newUser = {
                username: data.username,
                email: data.email,
                password: this._encodePassword(data.password)
            };
            return this.db.collection("users").insertOne(newUser, function (err, r) {
                cb(r.insertedId);
            });
        }
    }, {
        key: '_encodePassword',
        value: function _encodePassword(pwd) {
            return pwd;
        }
    }], [{
        key: 'connect',
        value: function connect(cb) {
            // Connection URL
            var url = process.env.DB_URL;

            // Database Name
            var dbName = process.env.DB_NAME;

            // Create a new MongoClient
            var client = new _mongodb.MongoClient(url);

            // Use connect method to connect to the Server
            client.connect(function (err) {
                var db = client.db(dbName);
                cb(client, db);
            });
        }
    }]);

    return MongoDbDriver;
}();
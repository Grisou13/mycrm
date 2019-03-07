"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HttpError = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var StatusCodes = {
  "400": "BadRequest",
  "401": "Unauthorized",
  "402": "PaymentRequired",
  "403": "Forbidden",
  "404": "NotFound",
  "405": "MethodNotAllowed",
  "406": "NotAcceptable",
  "407": "ProxyAuthenticationRequired",
  "408": "RequestTimeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "LengthRequired",
  "412": "PreconditionFailed",
  "413": "PayloadTooLarge",
  "414": "URITooLong",
  "415": "UnsupportedMediaType",
  "416": "RangeNotSatisfiable",
  "417": "ExpectationFailed",
  "418": "ImATeapot",
  "421": "MisdirectedRequest",
  "422": "UnprocessableEntity",
  "423": "Locked",
  "424": "FailedDependency",
  "425": "UnorderedCollection",
  "426": "UpgradeRequired",
  "428": "PreconditionRequired",
  "429": "TooManyRequests",
  "431": "RequestHeaderFieldsTooLarge",
  "451": "UnavailableForLegalReasons",
  "500": "InternalServerError",
  "501": "NotImplemented",
  "502": "BadGateway",
  "503": "ServiceUnavailable",
  "504": "GatewayTimeout",
  "505": "HTTPVersionNotSupported",
  "506": "VariantAlsoNegotiates",
  "507": "InsufficientStorage",
  "508": "LoopDetected",
  "509": "BandwidthLimitExceeded",
  "510": "NotExtended",
  "511": "NetworkAuthenticationRequired"
};

var HttpError =
/*#__PURE__*/
function (_Error) {
  _inherits(HttpError, _Error);

  function HttpError(message) {
    var _this;

    var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, HttpError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HttpError).call(this, message));
    _this.status = status;
    _this.headers = headers;
    _this._message = message;
    return _this;
  }

  _createClass(HttpError, [{
    key: "toString",
    value: function toString() {
      return this.getMessage();
    }
  }, {
    key: "getMessage",
    value: function getMessage() {
      return "[".concat(this.getStatusCode(), "] ").concat(this._message);
    }
  }, {
    key: "getStatusCode",
    value: function getStatusCode() {
      return this.status;
    }
  }, {
    key: "getStatusName",
    value: function getStatusName() {
      return StatusCodes[this.status];
    }
  }], [{
    key: "build",
    value: function build(message) {
      console.log(message);
      var res = HttpError.regex.exec(message);
      if (res) return new HttpError(res[2], parseInt(res[1]));
      return new HttpError(message);
    }
  }]);

  return HttpError;
}(_wrapNativeSuper(Error));

exports.HttpError = HttpError;

_defineProperty(HttpError, "regex", new RegExp(/\[(.*?)\]\s(.*)/, 'i'));

var _default = HttpError;
exports.default = _default;
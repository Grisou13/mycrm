"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userMiddleware = exports.authoroizedMiddleware = exports.RpcListener = exports.unWrapData = exports.wrapData = exports.wrapEmmiter = void 0;

var _koaCompose = _interopRequireDefault(require("koa-compose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var wrapEmmiter = function wrapEmmiter(func, ctx) {
  return function (name, data) {
    func(name, wrapData(data, ctx));
  };
};

exports.wrapEmmiter = wrapEmmiter;

var wrapData = function wrapData(data, request) {
  return Object.assign({}, {
    payload: data
  }, {
    XREQUEST: request
  });
};

exports.wrapData = wrapData;

var unWrapData = function unWrapData(data) {
  var req = data.XREQUEST;
  var payload = data.payload;
  return {
    payload: payload,
    request: req
  };
};

exports.unWrapData = unWrapData;

var RpcResponse =
/*#__PURE__*/
function () {
  function RpcResponse(rpcResponse) {
    _classCallCheck(this, RpcResponse);

    _defineProperty(this, "ctx", null);

    _defineProperty(this, "req", null);

    _defineProperty(this, "res", null);

    _defineProperty(this, "rpcResponse", null);

    this.rpcResponse = rpcResponse;
  }

  _createClass(RpcResponse, [{
    key: "send",
    value: function send(data) {
      this.ctx.body = data;
    }
  }]);

  return RpcResponse;
}();

var RpcRequest = //contains original request from http server
//contains original deepstream response
function RpcRequest(body, rawData) {
  var _this = this;

  _classCallCheck(this, RpcRequest);

  _defineProperty(this, "ctx", null);

  _defineProperty(this, "req", null);

  _defineProperty(this, "res", null);

  _defineProperty(this, "response", null);

  _defineProperty(this, "body", null);

  _defineProperty(this, "raw", null);

  this.raw = rawData;
  this.body = body;
  Object.keys(rawData).forEach(function (k) {
    _this[k] = rawData[k];
  });
};

var RpcContext =
/*#__PURE__*/
function () {
  function RpcContext() {
    _classCallCheck(this, RpcContext);

    _defineProperty(this, "req", null);

    _defineProperty(this, "res", null);
  }

  _createClass(RpcContext, [{
    key: "onerror",
    value: function onerror(err) {
      console.log(err);
    }
  }]);

  return RpcContext;
}();

var RpcListener =
/*#__PURE__*/
function () {
  function RpcListener(client) {
    _classCallCheck(this, RpcListener);

    this.client = client;
    this.events = {};
  }

  _createClass(RpcListener, [{
    key: "apply",
    value: function apply(name, cb) {
      if (!this.events[name]) {
        this.events[name] = [];
      }

      this.events[name] = [].concat(_toConsumableArray(this.events[name]), [cb]);
      return this;
    }
  }, {
    key: "respond",
    value: function respond(context) {
      console.log("SENDING BACK RESPONSE");
      console.log(context.body);
      console.log(context.res.body);
      if (!context.res._isAcknowledged && !context.res._isComplete) context.res.send(context.body || context.res.body); // don't do shit for now, let the callee respond by itself
    }
  }, {
    key: "handleRequest",
    value: function handleRequest(ctx, fnMiddleware) {
      var _this2 = this;

      var res = ctx.res;
      res.statusCode = 404;

      var onerror = function onerror(err) {
        return ctx.onerror(err);
      };

      var handleResponse = function handleResponse() {
        return _this2.respond(ctx);
      };

      return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    }
  }, {
    key: "createContext",
    value: function createContext(req, res) {
      var context = new RpcContext();
      var payload = req.payload,
          XREQUEST = req.XREQUEST;
      var request = context.request = new RpcRequest(payload, XREQUEST);
      var response = context.response = new RpcResponse(res);
      context.app = request.app = response.app = this;
      context.req = request.req = response.req = XREQUEST;
      context.res = request.res = response.res = res;
      request.ctx = response.ctx = context;
      request.response = response;
      response.request = request;
      context.state = {};
      return context;
    }
  }, {
    key: "callback",
    value: function callback(eventName) {
      var _this3 = this;

      var fn = (0, _koaCompose.default)(this.events[eventName]); //if (!this.listenerCount('error')) this.on('error', this.onerror);

      var handleRequest = function handleRequest(req, res) {
        var ctx = _this3.createContext(req, res);

        return _this3.handleRequest(ctx, fn);
      };

      return handleRequest;
    }
  }, {
    key: "run",
    value: function run() {
      var _this4 = this;

      Object.keys(this.events).map(function (name) {
        _this4.client.rpc.provide(name, _this4.callback(name));
      });
    }
  }, {
    key: "close",
    value: function close() {
      return this.client.close();
    }
  }]);

  return RpcListener;
}();

exports.RpcListener = RpcListener;

var authoroizedMiddleware = function authoroizedMiddleware(roles) {
  return function (ctx, next) {
    if (ctx.state.user.role in roles) {
      return next();
    }

    ctx.body = {
      error: "NOT_ALLOWED",
      message: "You are not allowed to view this ressources"
    };
    return next();
  };
};

exports.authoroizedMiddleware = authoroizedMiddleware;

var userMiddleware = function userMiddleware(ctx, next) {
  var request = ctx.req.XREQUEST || null;

  if (request) {
    ctx.state.user = request.USERID;
    ctx.state.token = request.TOKEN;
  }

  next();
};

exports.userMiddleware = userMiddleware;

var usageMiddleware = function usageMiddleware(ctx, next) {//handle some data
  // ctx.body = ....somedata
  // next()
};
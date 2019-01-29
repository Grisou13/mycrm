'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.userMiddleware = exports.authoroizedMiddleware = exports.RpcListener = exports.wrapClientEmmitterMiddleware = exports.buildClient = exports.wrapReceiver = exports.unwrappFunc = exports.unWrapData = exports.wrapData = exports.wrapEmmiter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var wrapEmmiter = exports.wrapEmmiter = function wrapEmmiter(func, ctx) {
    return function (name, data) {
        func(name, wrapData(data, ctx));
    };
};

var wrapData = exports.wrapData = function wrapData(data, ctx) {
    return Object.assign({}, { payload: data }, { XREQUEST: ctx.req });
};

var unWrapData = exports.unWrapData = function unWrapData(data) {
    var req = data.XREQUEST;
    var payload = data.payload;
    return {
        payload: payload,
        request: req
    };
};

var unwrappFunc = exports.unwrappFunc = function unwrappFunc(cb) {
    return function (d, response) {
        var data = unWrapData(d);
        cb(data.payload, data.request, response);
    };
};

var wrapReceiver = exports.wrapReceiver = function wrapReceiver(client) {
    return function (name, cb) {
        var func = function func(d, response) {
            var data = unWrapData(d);
            cb(data.payload, data.request, response);
        };
        client.rpc.provide(name, func);
    };
};

var buildClient = exports.buildClient = function buildClient(host) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var deepstream = require('deepstream.io-client-js');
    var client = deepstream(host);
    client.rpc.make = wrapEmmiter(client);
    client.rpc.provide = wrapReceiver(client);
    return client;
};

var wrapClientEmmitterMiddleware = exports.wrapClientEmmitterMiddleware = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        ctx.client.rpc.make = wrapEmmiter(ctx.client.rpc.make, ctx);

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function wrapClientEmmitterMiddleware(_x2) {
        return _ref.apply(this, arguments);
    };
}();

var RpcResponse = function RpcResponse() {
    _classCallCheck(this, RpcResponse);

    this.ctx = null;
    this.req = null;
    this.res = null;
};

var RpcRequest = function RpcRequest(rawData) {
    _classCallCheck(this, RpcRequest);

    this.ctx = null;
    this.req = null;
    this.res = null;

    var decoded = unWrapData(rawData);
    this.req = rawData.request;
    this.body = rawData.payload;
};

var RpcContext = function () {
    function RpcContext() {
        _classCallCheck(this, RpcContext);

        this.req = null;
        this.res = null;
        this.body = {};
    }

    _createClass(RpcContext, [{
        key: 'onerror',
        value: function onerror(err) {
            console.log(err);
        }
    }]);

    return RpcContext;
}();

var RpcListener = exports.RpcListener = function () {
    function RpcListener(client) {
        _classCallCheck(this, RpcListener);

        this.client = client;
        this.events = {};
    }

    _createClass(RpcListener, [{
        key: 'apply',
        value: function apply(name, cb) {
            if (!this.events[name]) {
                this.events[name] = [];
            }
            this.events[name] = [].concat(_toConsumableArray(this.events[name]), [cb]);
        }
    }, {
        key: 'respond',
        value: function respond(context) {
            this.res.send(this.ctx.body);
        }
    }, {
        key: 'handleRequest',
        value: function handleRequest(ctx, fnMiddleware) {
            var _this = this;

            var res = ctx.res;
            res.statusCode = 404;
            var onerror = function onerror(err) {
                return ctx.onerror(err);
            };
            var handleResponse = function handleResponse() {
                return _this.respond(ctx);
            };
            onFinished(res, onerror);
            return fnMiddleware(ctx).then(handleResponse).catch(onerror);
        }
    }, {
        key: 'createContext',
        value: function createContext(req, res) {
            var context = new RpcContext();
            var request = context.request = new RpcRequest(req);
            var response = context.response = new RpcResponse();
            context.app = request.app = response.app = this;
            context.req = request.req = response.req = req;
            context.res = request.res = response.res = res;
            request.ctx = response.ctx = context;
            request.response = response;
            response.request = request;

            context.state = {};
            return context;
        }
    }, {
        key: 'callback',
        value: function callback(eventName) {
            var _this2 = this;

            var fn = (0, _koaCompose2.default)(this.events[eventName]);
            //if (!this.listenerCount('error')) this.on('error', this.onerror);

            var handleRequest = function handleRequest(req, res) {
                //const ctx = this.createContext(req, res);
                return _this2.handleRequest(ctx, fn);
            };
            return handleRequest;
        }
    }, {
        key: 'run',
        value: function run() {
            var _this3 = this;

            Object.keys(this.events).map(function (name) {
                _this3.client.rpc.provide(name, _this3.callback(name));
            });
        }
    }]);

    return RpcListener;
}();

var authoroizedMiddleware = exports.authoroizedMiddleware = function authoroizedMiddleware(roles) {
    return function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!(ctx.state.user.role in roles)) {
                                _context2.next = 2;
                                break;
                            }

                            return _context2.abrupt('return', "BIEN OUEJ POTOT");

                        case 2:
                            ctx.body = {
                                error: "NOT_ALLOWED",
                                message: "You are not allowed to view this ressources"
                            };

                        case 3:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined);
        }));

        return function (_x3) {
            return _ref2.apply(this, arguments);
        };
    }();
};

var userMiddleware = exports.userMiddleware = function userMiddleware(ctx, next) {
    var request = ctx.req.XREQUEST || null;
    if (request) {
        ctx.state.user = request.USERID;
        ctx.state.token = request.TOKEN;
    }
    next();
};

var usageMiddleware = function usageMiddleware(ctx, next) {
    //handle some data
    // ctx.body = ....somedata
    // next()
};
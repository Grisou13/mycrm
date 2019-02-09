'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('dotenv').config();
var utils = require("utils");
var Koa = require('koa');
var koaBody = require('koa-body');
var deepstream = require('deepstream.io-client-js');

var app = new Koa();

//rpc client setup
var client = deepstream(process.env.DEEPSTREAM_HOST);
client.login(null);
app.context.client = client;
app.use(utils.rpc.wrapClientEmmitterMiddleware);

var router = require('koa-router')();

var dispatchFn = function dispatchFn(client) {
  return function (name, ctx) {
    return new Promise(function (resolve, reject) {
      client.rpc.make(name, utils.rpc.wrapData(ctx.request.body, ctx), function (err, res) {
        if (err) reject(err);

        ctx.res.respond(res);
        resolve(res);
      });
    });
  };
};

app.context.dispatch = dispatchFn(client);

router.get('/', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctx.body = "Api documentation";

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

router.post("/auth/verify", function (ctx, next) {});

router.post("/auth/signup", function (ctx, next) {});

router.post("/auth/session/create", function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx, next) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("AUTHENTICATING USER WITH REQUEST");
            console.log(ctx.req);
            _context2.next = 4;
            return ctx.dispatch("@auth/auth-user", ctx);

          case 4:
            ctx.body = "WOULOULOU";

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

router.post("/auth/session/destroy", function (ctx, next) {});

app.use(koaBody({
  jsonLimit: '1mb'
})).use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log("Listening on port 3000");
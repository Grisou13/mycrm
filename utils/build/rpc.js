"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var wrapEmmiter = exports.wrapEmmiter = function wrapEmmiter(client, ctx) {
    var func = client.rpc.make;
    client.rpc.make = function (name, data, cb) {
        data.REQUEST = ctx.request;
        func(name, data, cb);
    };
};

var wrapReceiver = exports.wrapReceiver = function wrapReceiver(client, ctx) {
    var func = client.rpc.provide;
    client.rpc.provide = function (name, cb) {
        func(name, function (data, response) {
            cb(data.REQUEST, ctx.req, response);
        });
    };
};
"use strict";

module.exports = function (ctx) {
    token = ctx.req.headers["X-ACCESS-TOKEN"];
    if (token) ctx.state.user = {
        token: token,
        user: jwt.decode(token).userId
    };
};
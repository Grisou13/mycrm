require('dotenv').config()
const utils = require("utils");
const Koa = require('koa');
const koaBody = require('koa-body');
const deepstream = require( 'deepstream.io-client-js' );

const app = new Koa();

//rpc client setup
// const client = deepstream(process.env.DEEPSTREAM_HOST);
// client.login(null);
// app.context.client = client
// app.use(utils.rpc.wrapClientEmmitterMiddleware);

const router = require('koa-router')();

router.get('/', function(ctx, next) {
 ctx.body = "Hello"
 return next();
});

app
  .use(koaBody({
    jsonLimit: '1mb'
  }))
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
console.log("Listening on port 3000");
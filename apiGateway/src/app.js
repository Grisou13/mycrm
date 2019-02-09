require('dotenv').config()
const utils = require("utils");
const Koa = require('koa');
const koaBody = require('koa-body');
const deepstream = require( 'deepstream.io-client-js' );

const app = new Koa();

//rpc client setup
const client = deepstream(process.env.EVENTHUB_HOST);
client.login(null);
app.context.client = client
const router = require('koa-router')();

const dispatchFn = (client) => (name, ctx) => {
  return new Promise( (resolve, reject) => {
    console.log("SENDING OVER:")
    const body = Object.assign({},ctx.request.body,ctx.request.query);
    console.log(body)
    client.rpc.make(name,utils.rpc.wrapData(body, ctx.request),(err,res)=>{
      if(err) reject(err);

      //ctx.res.respond(res);
      console.log(res)
      resolve(res)
    })
  })
  
}

app.context.dispatch = dispatchFn(client)

router.get('/', (ctx, next) => {
  ctx.body = "<html><body>Api documentation</body></html>" 
});

router.post("/auth/verify", (ctx, next) => {
  
})

router.post("/auth/signup", (ctx, next) => {

})

router.get("/auth/session/create", async (ctx, next) => {
  console.log("AUTHENTICATING USER WITH REQUEST")
  console.log(ctx.request)
  const token = await ctx.dispatch("@auth/auth-user", ctx)
  console.log(token);
  ctx.body = JSON.stringify(token)
})

router.post("/auth/session/destroy", (ctx, next) => {

})

app
  .use(koaBody({
    jsonLimit: '1mb'
  }))
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, '0.0.0.0');
console.log("Listening on port 3000");
require('dotenv').config()
const utils = require("utils");
const Koa = require('koa');
const koaBody = require('koa-body');
const deepstream = require( 'deepstream.io-client-js' );
const jwt = require("jsonwebtoken")
const axios = require("axios")
const retriveToken = require("./middlewares/token");
import {error} from 'utils'
import Bus from './dataBus/Bus';

const app = new Koa();

//rpc client setup
const client = deepstream(process.env.EVENTHUB_HOST);
client.login(null);
app.rpcClient = client;
app.httpClient = axios.create({

});
app.bus = new Bus(app);
app.context.client = client
const router = require('koa-router')();

//this will load all the different needed urls
const spec = new SpecParser(router)
spec.load();

const dispatchFn = () => (body = null, headers = null) => {
  if(body != null){
    ctx.state.proxyRequest.setBody(body)
  }
  if(headers != null){
    ctx.state.proxyRequest.setHeaders(headers)
  }
  ctx.app.bus.run(ctx.state.proxyRequest);
  // return new Promise( (resolve, reject) => {
    
  //   console.log(`sending (${name}):`)
  //   const payload = body == null ? Object.assign({}, ctx.params, ctx.request.body, ctx.request.query) : body;
  //   const request = {
  //     method: ctx.request.method, 
  //     url: ctx.request.url,
  //     header: ctx.request.header,
  //     "content-type": ctx.request["content-type"],
  //     user: ctx.request.user,
  //     body: payload,
  //   };
  //   console.log(`Payload: ${JSON.stringify(payload)}`)
  //   console.log(`Request: ${JSON.stringify(request)}`)
  //   client.rpc.make(name,utils.rpc.wrapData(payload, request),(err,res)=>{
  //     if(err) reject(error.build(err));

  //     //ctx.res.respond(res);
  //     //console.log(`response for ${name}: ${res}`)
  //     resolve(res)
  //   })
  // })
  
}

app.context.dispatch = dispatchFn(client)

router.use("path", validationFunc(validationRUles))

router.get('/', (ctx, next) => {
  ctx.body = "<html><body>Api documentation</body></html>" 
});

router.post("/auth/verify", (ctx, next) => {
  
})

router.post("/auth/signup", (ctx, next) => {

})

router.post("/auth/session/create", async (ctx, next) => {
  console.log("AUTHENTICATING USER WITH REQUEST")
  console.log(ctx.request)
  const token = await ctx.dispatch("@auth/auth-user", ctx)
  console.log(token);
  ctx.body = JSON.stringify(token)
})

router.post("/auth/session/destroy", async (ctx, next) => {
  let token = ctx.request.headers["X-TOKEN"] || null;
  token = token || ctx.request.query["token"] || null;
  const res = await ctx.dispatch("@auth/unvalidate", ctx, {token})
  ctx.body = JSON.stringify(res)
})
router.post("/signup", async (ctx, next) => {
  // signup needs all the data probably
  const password = ctx.request.body.password;
  let newUserData = {
    ...ctx.request.body
  }
  delete newUserData["password"];

  //user signup doesn't need the password so don't give it again across network
  const user = await ctx.dispatch("@users/signup", ctx, newUserData);

  const _ = await ctx.dispatch("@auth/signup",ctx, {...user, role: user.role.name, password, user_id: user._id});

  ctx.body = JSON.stringify(user);

})

router.post("/business", async ctx => {
  ctx.dispatch("@business/CREATE-BUSINESS", ctx)
})

router.get("/users/:user_id", async ctx => {
  console.log(ctx.params)
  ctx.body = JSON.stringify(await ctx.dispatch("@users/fetch", ctx))
})
router.get("/users", async ctx => {
  ctx.body = JSON.stringify(await ctx.dispatch("@users/fetch-all", ctx))
})

app
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  })
  .use(retriveToken())
  .use((ctx, next) => {
    if(ctx.request.token){
      console.log("GOT TOKEN")
      
      var decoded = jwt.decode(ctx.request.token)
      ctx.request.user = decoded.user_id
      console.log(decoded)
    }
    return next()
  })
  .use(koaBody({
    jsonLimit: '1mb'
  }))
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', (err, ctx) => {
  /* centralized error handling:
    *   console.log error
    *   write error to log file
    *   save error and request information to database if ctx.request match condition
    *   ...
  */
 console.error("An error occured")
 console.error(err)
});

app.listen(3000, '0.0.0.0');
console.log("Listening on port 3000");
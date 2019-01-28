require('dotenv').config()
const utils = require("utils");
const Koa = require('koa');
const app = new Koa();

const deepstream = require( 'deepstream.io-client-js' );
const client = deepstream(process.env.DEEPSTREAM_HOST);
client.login(null);

app.context.client = client
app.context.rpc = (event, data) => {
  this.client.emit(event,Object.assign({},data,{REQUEST: this}))
}

//app.context.client = utils.rpc.wrapEmitter(client, app.request)

app.use(async ctx => {
  ctx.rpc("test","some data");
  
  ctx.body = 'Hello World';
});

app.listen(3000);
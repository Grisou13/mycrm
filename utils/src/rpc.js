import compose from 'koa-compose'

export const wrapEmmiter = (func, ctx) => {
    return (name,data) => {
        func(name, wrapData(data,ctx))
    }
}

export const wrapData = (data, ctx) => {
    return Object.assign({}, {payload:data}, {XREQUEST: ctx.req} )
}

export const unWrapData = (data) => {
    const req = data.XREQUEST;
    const payload = data.payload;
    return {
        payload: payload,
        request: req
    }
}

export const unwrappFunc = (cb) => {
    return ( d, response ) => {
        const data = unWrapData(d);
        cb(data.payload, data.request ,response)
    }
}

export const wrapReceiver = (client) => {   
    return (name, cb) => {
        const func = ( d, response ) => {
            const data = unWrapData(d);
            cb(data.payload, data.request ,response)
        }
        client.rpc.provide(name, func)
    }
}

export const buildClient = (host, params = null) => {
    const deepstream = require( 'deepstream.io-client-js' );
    let client = deepstream(host);
    client.rpc.make = wrapEmmiter(client);
    client.rpc.provide = wrapReceiver(client)
    return client
}

export const wrapClientEmmitterMiddleware = async ctx => {
    ctx.client.rpc.make = wrapEmmiter(ctx.client.rpc.make, ctx);
}

class RpcResponse{
    ctx = null;
    req = null;
    res = null;
}

class RpcRequest{
    ctx = null;
    req = null;
    res = null;
    constructor(rawData){
        const decoded = unWrapData(rawData);
        this.req = rawData.request;
        this.body = rawData.payload
    }
}
class RpcContext{
    req = null;
    res = null;
    body = {};
    onerror(err){
        console.log(err)
    }
}

export class RpcListener{
    constructor(client){
        this.client = client;
        this.events = {};
    }
    apply(name, cb){
        if(!this.events[name]){
            this.events[name] = []
        }
        this.events[name] = [...this.events[name], cb]
    }
    respond(context){
        this.res.send(this.ctx.body)
    }
    handleRequest(ctx, fnMiddleware) {
        const res = ctx.res;
        res.statusCode = 404;
        const onerror = err => ctx.onerror(err);
        const handleResponse = () => this.respond(ctx);
        onFinished(res, onerror);
        return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    }
    createContext(req, res) {
        const context = new RpcContext();
        const request = context.request = new RpcRequest(req);
        const response = context.response = new RpcResponse();
        context.app = request.app = response.app = this;
        context.req = request.req = response.req = req;
        context.res = request.res = response.res = res;
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        
        context.state = {};
        return context;
    }
    callback(eventName){

        const fn = compose(this.events[eventName]);
        //if (!this.listenerCount('error')) this.on('error', this.onerror);

        const handleRequest = (req, res) => {
            //const ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fn);
        };
        return handleRequest;
    }
    run(){
        Object.keys(this.events).map( (name) => {
            this.client.rpc.provide(name, this.callback(name))
        })
        
    }
}

export const authoroizedMiddleware = (roles) => async (ctx, next) => {
    if( ctx.state.user.role in roles ){
        await next();
    }
    ctx.body = {
        error: "NOT_ALLOWED",
        message: "You are not allowed to view this ressources"
    };

}

export const userMiddleware = (ctx, next) => {
    const request = ctx.req.XREQUEST || null;
    if(request){
        ctx.state.user = request.USERID;
        ctx.state.token = request.TOKEN;
    }
    next();
}

const usageMiddleware = (ctx, next) => {
    //handle some data
    // ctx.body = ....somedata
    // next()
}
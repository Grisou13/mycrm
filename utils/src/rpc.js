import compose from 'koa-compose'
import sanitize from './sanitize'
export const wrapEmmiter = (func, ctx) => {
    return (name,data) => {
        func(name, wrapData(data,ctx))
    }
}

export const wrapData = (data, request) => {
    return Object.assign({}, {payload:data}, {XREQUEST: request} )
}

export const unWrapData = (data) => {
    const req = data.XREQUEST;
    const payload = data.payload;
    return {
        payload: payload,
        request: req
    }
}


class RpcResponse{
    ctx = null;
    req = null;
    res = null;
    rpcResponse = null;
    constructor(rpcResponse){
        this.rpcResponse = rpcResponse;
    }
    send(data){
        this.ctx.body = data;
    }
}

class RpcRequest{
    ctx  = null;
    req  = null; //contains original request from http server
    res  = null; //contains original deepstream response
    response = null;
    body = null;
    raw  = null;
    constructor(body, rawData){
        this.raw = rawData
        Object.keys(rawData).forEach( k => {
            this[k] = rawData[k]
        })
        this.body = body;
    }
}
class RpcContext{
    req = null;
    res = null;
    onerror(err){
        console.log(err)
    }
}

export const modelBuilder = (validator, modelKlass) => (data) => {
    const model = modelKlass.build(data);
    const result = await validator.validate(model.toObj())
    return result == true? model : null;
}
export class Model{
    data = {};
    _raw = {};
    static fields;
    constructor(data){
        this._raw = data
        this.sanitize()
    }
    sanitize(){
        this.data = sanitize(this._raw)
    }
    
    static build( data ){
        const m = new Model(data);
        return m;
    }
    toObj(){
        return this.data;
    }
}

export class RpcListener{
    constructor(client){
        this.client = client;
        this.events = {};
        this.middlewares = [];
    }
    apply(name, cb){
        if(!this.events[name]){
            this.events[name] = []
        }
        this.events[name] = [...this.events[name], cb]
        return this;
    }
    applyGlobal(cb){
        this.middlewares = [cb,...this.middlewares]
    }
    respond(context){
        console.log("SENDING BACK RESPONSE")
        console.log(context.body)
        console.log(context.res.body)
        if(!context.res._isAcknowledged && !context.res._isComplete)
            context.res.send(context.body || context.res.body)
        // don't do shit for now, let the callee respond by itself
    }

    handleRequest(ctx, fnMiddleware) {
        const res = ctx.res;
        res.statusCode = 404;
        const onerror = err => ctx.onerror(err);
        const handleResponse = () => this.respond(ctx);
        return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    }

    createContext(req, res) {

        const context = new RpcContext();
        const {payload, XREQUEST} = req;
        let request = context.request = new RpcRequest(payload, XREQUEST);
        let response = context.response = new RpcResponse(res);
        context.app = request.app = response.app = this;
        context.req = request.req = response.req = XREQUEST;
        context.res = request.res = response.res = res;
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        
        context.state = {};
        return context;
    }
    callback(eventName){

        const fn = compose([ ...this.middlewares ,...this.events[eventName] ]);
        //if (!this.listenerCount('error')) this.on('error', this.onerror);

        const handleRequest = (req, res) => {
            const ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fn);
        };
        return handleRequest;
    }
    run(){
        Object.keys(this.events).map( (name) => {
            this.client.rpc.provide(name, this.callback(name))
        })
    }
    close(){
        return this.client.close();
    }
}

export class Service {
    constructor(rpcListener, httpListener){
        this.rpcListener = rpcListener;
        this.httpListener = httpListener;
    }
    
    apply(name, cb){
        this.rpcListener.apply(name,cb);
    }
    run(){
        this.rpcListener.run();
        this.httpListener.run();
    }
    addAction(actionConfig){
        this.rpcListener.apply(actionConfig.path, actionConfig.callback);
        return this;
    }
    addUrl(urlConfig){
        this.httpListener.router[urlConfig.method](urlConfig.name, urlConfig.path, urlConfig.callback);
    }
    addHttpMiddleware(callback){
        this.httpListener.server.apply(callback);
    }
    addRpcMiddleware(callback){
        this.rpcListener.applyGlobal(callback);
    }
}

export const authoroizedMiddleware = (roles) => (ctx, next) => {
    if( ctx.state.user.role in roles ){
        return next();
    }
    ctx.body = {
        error: "NOT_ALLOWED",
        message: "You are not allowed to view this ressources"
    };
    return next();
}

export const userMiddleware = (ctx, next) => {
    const request = ctx.req.XREQUEST || null;
    if(request){
        ctx.state.user = request.USERID;
        ctx.state.token = request.TOKEN;
    }
    next();
}
/**
 * Extracts the data from the request and serializes it
 */

 class ProxyRequest{
     constructor(ctx){
        const payload = Object.assign({}, ctx.request.body, ctx.request.query);
        const request = {
          method: ctx.request.method, 
          url: ctx.request.url,
          headers: ctx.request.header,
          "content-type": ctx.request["content-type"],
          user: ctx.request.user,
          body: payload,
          query: ctx.query,
          params: ctx.params,
          cookies: ctx.cookies,
        };
        this.request = request;
        this.payload = payload;
     }
     setBody(body){
        this.request.body = body;
        this.payload = body;
     }
     setHeaders(headers){
         this.requres.headers = headers;
     }
     serialize(){
        return {
            payload: this.payload,
            XREQUEST: this.request
        }
    }
}

export default () => async (ctx, next) => {
    ctx.state.proxyRequest = new ProxyRequest(ctx);
    return next();
}
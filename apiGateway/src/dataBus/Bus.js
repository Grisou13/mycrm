import {HttpBus} from './http'
import {RpcBus} from './rpc'
export class Bus{
    schemaRegex = /(.*)(:\/\/)(.*$)/gm;
    constructor(app){
        this.proxies = {
            [HttpBus.schema]: HttpBus(app.httpClient),
            [RpcBus.schema]: RpcBus(app.rpcClient),
        };
    }
    getSchema(url){
        const res = this.schemaRegex.exec(url)
        return res.result[1];
    }
    getUrl(url){
        const res = this.schemaRegex.exec(url)
        return res.result[3];
    }
    
    run(url, request){
        return this.proxies[this.getSchema(url)].send(this.getUrl(url), request)
    }
}
export default Bus;
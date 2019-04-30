import {HttpBus} from './http'
import {RpcBus} from './rpc'
export class Bus{
    schemaRegex = /(.*)(?::\/\/)(.*$)/gm;
    constructor(app){
        this.proxies = {
            [HttpBus.schema]: HttpBus(app),
            [RpcBus.schema]: RpcBus(app),
        };
    }
    getSchema(url){
        const res = this.schemaRegex.exec(url)
        return res.result[1];
    }
    getUrl(url){
        const res = this.schemaRegex.exec(url)
        return res.result[2];
    }
    
    run(url, request){
        return this.proxies[this.getSchema(url)].send(this.getUrl(url), request)
    }
}
export default Bus;
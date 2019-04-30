export class RpcBus{
    static schema = "rpc";
    constructor(app){
        this.cleint = app.rpcClient;
    }
    send(url, request){
        return new Promise( (resolve, reject) => {
            this.client.rpc.make(url, request.serialize(), (err,res)=>{
                if(err) return reject(err);
                resolve(res)
            })
        })
    }
}

export default RpcBus
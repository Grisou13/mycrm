import events from 'business.events'
import utils from 'utils'

export default class BusinessListener{
    constructor(client){
        this.rpcClient = new utils.rpc.RpcListener(client);
        this.attachCallbacks(this.rpcClient)
        console.log(events)
    }

    attachCallbacks(listener){
        this.registerCallback(listener, events.CREATE_BUSINESS, (request) => {
            
        })
    }

    registerCallback(listener, name, cb){
        listener.apply( name, ( ctx ) => {
            cb(ctx.request, ctx.res)
            .then( res => ctx.res.send(res))
            .catch(err => {
                console.log(`Error while treating ${name}`)
                console.log(err)
                if(err instanceof utils.error){
                    ctx.res.error(err.toString())
                }
                else
                    ctx.res.error(`${err}`)
            })
        });
    }

    run(){
        this.rpcClient.run()
    }
    close(){
        this.rpcClient.close();
        this.db.close();
    }
}

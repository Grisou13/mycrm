import events from 'auth.events'
import utils from 'utils'
export default class AuthService{
    constructor(client){
        this.client = client;
    }
    reportError(error){
        console.log("error",error)
    }
    rpcResponseHandler( cb ){
        return (err,res) => {
            if(err) this.reportError(err)
            console.log("Received response %s", res);
            if(cb) cb(res)
        }
    }
    
    createUser(credentials, cb){
        this.run(events.CREATE_USER, credentials,this.rpcResponseHandler(cb) )
    }
    login(credentials, cb){
        this.run(events.AUTH_USER, credentials, this.rpcResponseHandler(cb) )
    }
    close(){
        this.client.close();
    }
    run(event, data, cb){
        this.client.rpc.make(event, data, cb);
    }
}
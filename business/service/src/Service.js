import events from 'business.events'
export default class Service{
    constructor(client){
        this.client = client;
    }
    
    close(){
        return this.client.close();
    }
    _run(event, data){
        return new Promise( (resolve,reject) => {
            this.client.rpc.make(event, data, (err,res) => {

                if(err) reject(err)
                console.log("Received response %s", res);
                resolve(res)
            });
        })
        
    }
}
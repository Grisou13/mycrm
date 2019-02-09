import events from 'auth.events'
export default class AuthService{
    constructor(client){
        this.client = client;
    }
    
    /**
     * 
     * @param {Object} credentials
     * @return Promise with a valid user
     */
    createUser(credentials){
        return this._run(events.CREATE_USER, credentials)
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
import events from 'user.events'
import User from './User'
import utils from 'utils'


export default class AuthListener{
    constructor(client, driver){
        this.rpcClient = new utils.rpc.RpcListener(client);
        this.driver = driver;
        this.user = new User(this.driver)
        this.attachCallbacks(this.rpcClient)
        console.log(events)
    }

    attachCallbacks(listener){
        this.registerCallback(listener, events.CREATE_USER, (data) => {
            return this.user.signup(data).then(user => {
                console.log("Created user")
                console.log(user)
                return user
            })
        })
        this.registerCallback(listener, events.FETCH_USER, (data) => {
            return this.user.fetch(data.user_id)
        })
        this.registerCallback(listener, events.FETCH_ALL_USERS, (data) => {
            console.log("FETCHING ALL USERS")
            return this.user.fetchAll(data || {}).then( users => {
                console.log(users)
                return users
            })
        })
    }

    registerCallback(listener, name, cb){
        listener.apply( name, ( ctx ) => {
            cb(ctx.request.body, ctx.res)
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
        this.driver.close();
    }
}

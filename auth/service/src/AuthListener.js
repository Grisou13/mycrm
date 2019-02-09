import events from 'auth.events'
import Auth from './Auth'
import MongoDbDriver from './MongoDbDriver'
import utils from 'utils'


export default class AuthListener{
    constructor(client, dbClient, db){
        this.rpcClient = new utils.rpc.RpcListener(client);
        this.driver = new MongoDbDriver(dbClient, db);
        this.auth = new Auth(this.driver)
        this.attachCallbacks(this.rpcClient)
    }

    attachCallbacks(listener){
        this.registerCallback(listener, events.AUTH_USER, ( data, response ) => {
            this.auth.login(data)
            .then( (token) => {
                response.send( {
                    token: token,
                } );
            }).catch( (err) => {
                response.send({
                    error: err
                })
            })
        });
        
        this.registerCallback(listener, events.GENERATE_TOKEN, ( data, response ) => {
            this.auth.generateToken(...data)
            .then( (token) => {
                response.send( {
                    token
                });
            })
        });
        this.registerCallback(listener, events.VALIDATE_TOKEN, ( data, response ) => {
            this.auth.validate(data)
            .then( (res) => {
                response.send({
                    validity: res
                })
            })
        });
        this.registerCallback(listener, events.DESTROY_TOKEN, ( data, response ) => {
            this.auth.unvalidate(data)
            .then((res) => {
                response.send( {
                    done: res
                } );
            })
        });

        this.registerCallback(listener, events.CREATE_USER, (data, response) => {
            this.auth.signup(data)
            .then((user)=>{
                response.send({
                    userId: user._id
                })
            })
        })
    }

    registerCallback(listener, name, cb){
        listener.apply( name, ( ctx ) => {
            console.log(ctx.request)

            cb(ctx.request.body, ctx.res)
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

import events from 'auth.events'
import {Auth, MongoDbDriver} from './auth'
import utils from 'utils'


export default class AuthListener{
    constructor(client){
        console.log(utils.rpc)
        this.rpcClient = new utils.rpc.RpcListener(client);
        
    }
    attachCallbacks(listener){
        this.registerCallback(listener, events.AUTH_USER, ( data, response ) => {
            this.auth.login(data, (token) => {
                response.send( {
                    token: token,
                } );
            }, (err) => {
                response.send({
                    error: err
                })
            })
        });
        
        this.registerCallback(listener, events.GENERATE_TOKEN, ( data, response ) => {
            this.auth.generateToken(data, (token) => {
                response.send( {
                    token
                });
            })
        });
        this.registerCallback(listener, events.VALIDATE_TOKEN, ( data, response ) => {
            this.auth.validate(data, (res) => {
                response.send({
                    validity: res
                })
            })
        });
        this.registerCallback(listener, events.DESTROY_TOKEN, ( data, response ) => {
            this.auth.unvalidate(data, (res) => {
                response.send( {
                    done: res
                } );
            })
        });

        this.registerCallback(listener, events.CREATE_USER, (data, response) => {
            this.auth.signup(data, (userId)=>{
                response.send({
                    userId: userId
                })
            })
            
            
        })
        
    }
    registerCallback(listener, name, cb){
        listener.apply( name, ( request, response ) => {
            cb(request.body,response)
        });
    }
    run(){
        MongoDbDriver.connect( (dbClient, db) => {
            this.driver = new MongoDbDriver(dbClient, db);
            this.auth = new Auth(this.driver)
            this.attachCallbacks(this.rpcClient)
        })
    }    
}

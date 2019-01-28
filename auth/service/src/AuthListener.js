import events from 'auth.events'
import {Auth, MongoDbDriver} from './auth'
export default class AuthListener{
    constructor(client){
        this.rpcClient = client;
        
    }
    attachCallbacks(client){
        this.registerCallback(client, events.AUTH_USER, ( data, response ) => {
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
        
        this.registerCallback(client, events.GENERATE_TOKEN, ( data, response ) => {
            this.auth.generateToken(data, (token) => {
                response.send( {
                    token
                });
            })
        });
        this.registerCallback(client, events.VALIDATE_TOKEN, ( data, response ) => {
            this.auth.validate(data, (res) => {
                response.send({
                    validity: res
                })
            })
        });
        this.registerCallback(client, events.DESTROY_TOKEN, ( data, response ) => {
            this.auth.unvalidate(data, (res) => {
                response.send( {
                    done: res
                } );
            })
        });

        this.registerCallback(client, events.CREATE_USER, (data, response) => {
            this.auth.signup(data, (userId)=>{
                response.send({
                    userId: userId
                })
            })
            
            
        })
        
    }
    registerCallback(client, name, cb){
        client.rpc.provide( name, ( data, response ) => {
            cb(data,response)
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

import events from 'user.events'
import User from './User'
import {MongoDbDriver} from './MongoDbDriver'
import utils from 'utils'
import AuthService from 'auth.service/AuthService';


export default class AuthListener{
    constructor(client){
        this.rpcClient = new utils.rpc.RpcListener(client);
        this.authService = new AuthService(client);
    }

    attachCallbacks(listener){
        this.registerCallback(listener, events.CREATE_USER, (data, response) => {
            this.user.signup(data)
            .then( user => {
                return Promise.all([
                    new Promise ( resolve => resolve(user)),
                    this.authService.signup({user_id: user._id,...data}),
                ])
                
            }).then( ([user, _]) => {
                return this.authService.generateToken({user_id: user._id}).then( (token) => {
                    console.log("CREATED USER: ")
                    console.log(user)
                    response.send({user, token})
                })
                
            })
        })
        this.registerCallback(listener, events.FETCH_USER, (data, response) => {
            this.user.fetch(data).then( user => {
                response.send(user)
            })
        })
        this.registerCallback(listener, events.FETCH_ALL_USERS, (data, response) => {
            this.user.fetchAll(data || {}).then( users => {
                response.send(users)
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
        MongoDbDriver.connect( (dbClient, db) => {
            this.driver = new MongoDbDriver(dbClient, db);
            this.user = new User(this.driver)
            this.attachCallbacks(this.rpcClient)
            this.rpcClient.run()
        })
    }
    close(){
        this.rpcClient.close();
        this.driver.close();
    }
}

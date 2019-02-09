import { MongoClient, ObjectID } from 'mongodb'
import User from './models/User'

export default class MongoDbDriver{
    constructor(client, db){
        this.db = db
        this.client = client;
    }
    static connect(cb){
        // Connection URL
        const url = process.env.DB_URL;

        // Database Name
        const dbName = process.env.DB_NAME;

        // Create a new MongoClient
        const client = new MongoClient(url);
       
        // Use connect method to connect to the Server
        client.connect((err) => {
            const db = client.db(dbName);
            cb(client,db);
        });
    }
    close(){
        return this.client.close();
    }
    fetchUser(credentials){
        return new Promise( (resolve, reject) => {
            this.db.collection("users").findOne({
                "password": this._encodePassword(credentials.password), 
                $or: [ 
                    {"email":credentials.identifier},
                    {"username":credentials.identifier} 
                ]
            }, (err, r)=>{
                if(err) reject(err)
                resolve(User.build(r))
            })
        })
    }
    checkUserExists(identifier){
        return new Promise( (resolve,reject) => {
            this.db.collection("users").findOne({ $or: [ {"email": identifier},{"username": identifier} ]}, function(err, r){
                if(err) return reject(err);
                if(r)
                    resolve(true);
                resolve(false);
            })
        })
    }
    
    logToken(userId, token){
        this.db.collection("tokens").insertOne({
            userId,
            token
        })
    }
    resignToken(token){
        return new Promise( (resolve, reject) => {
            const res = this.db.collection("tokens").remove({
                "token": token
            },
            {
                justOne: true,
            });
            if(res.nRemoved <= 1){
                resolve(token);
            }else{
                reject(res)
            }
        })
        
    }
    checkIfTokenExists(token){
        return new Promise( (reject, resolve) => {
            this.db.collection("tokens").findOne({token: token}, (err, r) => {
                if(err) return reject(err);

                if(r)
                    return resolve(true);

                return resolve(false);
            })
        })
    }
    createUser(data){
        return new Promise( (reject, resolve) => {
            const newUser = {
                user_id: data.user_id || null,
                username: data.username,
                email: data.email,
                password: this._encodePassword(data.password)
            }
            this.db.collection("users").insertOne(newUser, function(err, r){
                if(err) reject(err)
                resolve(User.build(r.ops[0]))
            })
        })
        
        
    }
    _encodePassword(pwd){
        return pwd;
    }
}
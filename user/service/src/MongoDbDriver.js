import { MongoClient, ObjectID } from 'mongodb'
import User from './models/User'

export class MongoDbDriver{
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
                    resolve(r);
                resolve(false);
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
    fetchAll(...args){
        return new Promise( (resolve, reject) => {
            this.db.collection("users").find(...args)
        })
    }
    updateUser(user_id, update){
        return new Promise( (resolve, reject) => {
            this.db.collection("users").update({
                _id: user_id
            },
            {
                $set: {
                    ...update,
                    updated_at: Date.now(),
                }
            },
            {
                upsert: true
            }, (err,res) => {
                if(err) return reject(err);
                resolve(res)
            })
        })
    }
    deleteUser(user_id){
        return new Promise( (resolve, reject) => {
            this.db.collection("users").deleteOne({_id: user_id}, (err,res) => {
                if(err) return reject(err);
                resolve(res)
            })
        })
    }
    _encodePassword(pwd){
        return pwd;
    }
}
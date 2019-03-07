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
    fetchUser(id){
        return new Promise( (resolve, reject) => {
            try{
                this.db.collection("users").findOne({
                    "_id": new ObjectID(id),
                }, (err, r)=>{
                    
                    if(err) return reject(err)
                    if(r!=null)
                        resolve(User.build(r))
                    reject("User not found")
                })
            }catch(err){
                reject("Id not valid")
            }
        })
    }
    checkUserExists(identifier){
        return new Promise( (resolve,reject) => {
            if(identifier instanceof Array){
                identifier = { $in: identifier }
            }
            this.db.collection("users").findOne({ $or: [ {"email": identifier},{"username": identifier} ]}, function(err, r){
                if(err) return reject(err);
                if(r)
                    resolve(r);
                resolve(false);
            })
        })
    }
    
   
    createUser(data){
        return new Promise( (resolve, reject) => {
            //this.db.collection("roles").findOne({name:"user"}, function(err,role){
                const newUser = {
                    username: data.username,
                    email: data.email,
                    role: data.role ? data.role: "user"
                }
                this.db.collection("users").insertOne(newUser, function(err, r){
                    console.log("IN DATABASE")
                    console.log(r.ops[0])
                    console.log("errors?")
                    console.log(err)
                    if(err) reject(err)
                    resolve(User.build(r.ops[0]))
                })
            //})
            
        })  
    }
    fetchAll(query){
        return new Promise( (resolve, reject) => {
            this.db.collection("users").find(query).toArray( (err, res) => {
                if(err) reject(err)
                resolve(res)
            })
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
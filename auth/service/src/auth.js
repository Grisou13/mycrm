import jwt from 'jsonwebtoken'
import { MongoClient, ObjectID } from 'mongodb'
const fs = require('fs');
export class Auth{

    constructor(driver){
        this.driver = driver;
    }
    fetchCert(){
        return fs.readFileSync('private.key');
    }
   
    generateToken(userId, cb){
        
        // sign with RSA SHA256
        let exp = Math.floor(Date.now() / 1000) + (60 * 60);
        var cert = fs.readFileSync('private.key');
        var token = jwt.sign({userId: userId, exp}, cert, { algorithm: 'RS256'});
        this.driver.logToken(userId,token);
        cb(token)
        return true;
    }
    login(credentials, cb, cbErr){
        this.driver.checkUserExists(credentials.identifier, (found) => {
            if(!found){
                return cbErr("User not found");
            }
            this.driver.checkCredentials(credentials, (user)=>{
                if(user)
                    return this.generateToken(user._id, cb);
                cbErr("username and password wrong")
            })
        })
    }

    signup(credentials, cb){
        if(!this.driver.checkUserExists(credentials.email)){
            return false;
        }
        this.driver.createUser(credentials, cb);
        return true;
    }

    unvalidate(token, cb){
        cb(this.driver.resignToken(token))
    }
    verifyToken(token, cb){
        this.driver.checkIfTokenExists(token, (found) => {
            if(found){
                let cert = this.fetchCert()
                cb(jwt.verify(token, cert))
            }
            cb(false)
        })
    }
    
}

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
    fetchUser(credentials, cb){
        this.db.collection("users").findOne({
            "password": this._encodePassword(credentials.password), 
            $or: [ 
                {"email":credentials.identifier},
                {"username":credentials.identifier} 
            ]
        }, (err, r)=>{
            cb(r)
        })
    }
    checkUserExists(identifier, cb){
        this.db.collection("users").findOne({ $or: [ {"email": identifier},{"username": identifier} ]}, function(err, r){
            if(!err && r)
                return cb(true);
            cb(false);
        })
    }
    checkCredentials(credentials, cb){
        this.fetchUser(credentials, (user) => {
            cb(user)
        })
    }
    logToken(userId, token){
        this.db.collection("tokens").insertOne({
            userId,
            token
        })
    }
    resignToken(token){
        const res = this.db.collection("tokens").remove({
            "token": token
        },
        {
            justOne: true,
        });
        return res.nRemoved > 0;
    }
    checkIfTokenExists(token, cb){
        this.db.collection("tokens").findOne({token: token}, (err, r) => {
            if(r)
                return cb(true);

            return cb(false);
        })
    }
    createUser(data, cb){
        const newUser = {
            username: data.username,
            email: data.email,
            password: this._encodePassword(data.password)
        }
        return this.db.collection("users").insertOne(newUser, function(err, r){
            cb(r.insertedId)
        })
        
    }
    _encodePassword(pwd){
        return pwd;
    }
}
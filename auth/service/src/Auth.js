import jwt from 'jsonwebtoken'
const fs = require('fs');
export default class Auth{

    constructor(driver){
        this.driver = driver;
    }
    fetchCert(){
        return fs.readFileSync('private.key');
    }
    /**
     * Generate a jwt token identified by data passed in arguments
     * @param {Object} data { userId: required, }
     */
    generateToken(data){
        return new Promise( (resolve, reject) => {
            try{
                // sign with RSA SHA256
                let exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
                var cert = this.fetchCert();
                var token = jwt.sign({exp, ...data}, cert, { algorithm: 'RS256'});
                this.driver.logToken(data.user_id,token);
                resolve(token)
            }catch(err){
                reject(err)
            }
        })
    }
    /**
     * 
     * @param {Object} credentials {identifier: string, password: string}
     */
    login(credentials){
        return this.driver.checkUserExists(credentials.identifier)
        .then((found) => {
            if(!found){
                throw new Error("User not found");
            }
            return this.driver.fetchUser(credentials)
        }).then( (user)=>{
            if(user)
                return this.generateToken(user._id);
            throw new Error("username and password wrong")
        })
    }

    signup(credentials){
        return this.driver.checkUserExists(credentials.email)
        .then( found => {
            if(!found){
                throw new Error("User already exists")
            }
            return this.driver.createUser(credentials)
        })
        
    }

    unvalidate(token){
        return (this.driver.resignToken(token))
    }
    verifyToken(token){
        this.driver.checkIfTokenExists(token).then( (found) => {
            if(found){
                let cert = this.fetchCert()
                return (jwt.verify(token, cert))
            }
            return (false)
        })
    }
    
}


import jwt from 'jsonwebtoken'
const fs = require('fs');
import {error} from 'utils'
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
                throw new error("User not found", 404);
            }
            return this.driver.fetchUser(credentials)
        }).then( (user)=>{
            console.log("LOGGING IN USER");
            console.log(user)
            if(user){
                if(user.locked == false)
                    return this.generateToken({user_id: `${user.user_id}`, role: user.role});
                throw new error("User is locked out",401)
            }
            throw new error("username and password wrong", 401)
        })
    }

    signup(credentials){
        return Promise.all([
            this.driver.checkUserExists(credentials.email),
            this.driver.checkUserExists(credentials.username),
        ])
        .then( values => {
            const found = values.every( (val) => !!val )
            console.log(found)
            if(found){
                throw new error("User already exists", 409)
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
            throw new error("Token not found", 404)
        })
    }

    resetPassword(email, password){
        
    }
    forgotPassword(email){
        return this.driver.checkUserExists(email).then( user => {
            this.driver.lockoutUser(user._id).then(token => {
                this.sendRecoveryEmail(token)
            })
        })
    }
    sendRecoveryEmail(token){
        return true;
    }
    
}


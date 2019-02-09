import jwt from 'jsonwebtoken'
const fs = require('fs');
export default class User{

    constructor(driver){
        this.driver = driver;
    }

    signup(credentials){
        return Promise.all([
            this.driver.checkUserExists(credentials.email),
            this.driver.checkUserExists(credentials.username),
        ])
        .then( values => {
            const found = values.every( (val) => !!val )
            if(!found){
                throw new Error("User already exists")
            }
            return this.driver.createUser(credentials)
        })
        
    }
    fetch(credentials){
        return this.driver.fetchUser(credentials)
       
    }
    fetchAll(query){
        return this.driver.fetchAll(query)
    }

    
}


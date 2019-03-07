import {error} from 'utils'
export default class User{
    /**
     * @var MongoDbDriver
     */
    driver = null;
    constructor(driver){
        this.driver = driver;
    }

    signup(credentials){
        console.log("signing up new user ", credentials)
        return this.driver.checkUserExists([credentials.email,credentials.username])
        .then( found => {
            console.log(found)
            if(found){
                throw new error("User already exists", 409)
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


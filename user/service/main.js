require('dotenv').config()
const deepstream = require( 'deepstream.io-client-js' );

let UserListener;
let MongoDbDriver;
if(process.env.NODE_ENV == 'production'){
    UserListener = require('./build/UserListener').default;
    MongoDbDriver = require('./build/MongoDbDriver').default;
}else{
    UserListener = require('./src/UserListener').default;
    MongoDbDriver = require('./src/MongoDbDriver').default;
}
const client = deepstream(process.env.EVENTHUB_HOST);
let service = null;
console.log(MongoDbDriver)

try{
    MongoDbDriver.connect( (dbClient, db) => {
        client.login(null, (success, data) => {
            if (success) {
                console.log("Connected as ", data);
                const driver = new MongoDbDriver(dbClient, db)
                service = new UserListener(client, driver);
                service.run();
              
            } else {
                throw new Error("Unable to connect to deepstream")
            }
        })
    })
}catch(err){
    console.log(err);
}finally{
    if(service != null)
        service.close()
}

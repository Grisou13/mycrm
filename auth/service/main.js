require('dotenv').config()
const deepstream = require( 'deepstream.io-client-js' );
let AuthListener;
let MongoDbDriver;
if(process.env.NODE_ENV == 'production'){
    AuthListener = require('./build/AuthListener').default;
    MongoDbDriver = require('./build/MongoDbDriver').default;
}else{
    AuthListener = require('./src/AuthListener').default;
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
                service = new AuthListener(client, driver);
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

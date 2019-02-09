require('dotenv').config()
require("./build");

const deepstream = require( 'deepstream.io-client-js' );

//const AuthService = require("./AuthService");
const UserListener = require('./build/UserListener').default;

const client = deepstream(process.env.DEEPSTREAM_HOST);
client.login(null);

const service = new UserListener(client);
try{
    service.run();
}catch(err){
    console.log(err);
    service.close()
}

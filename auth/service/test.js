require('dotenv').config()
const deepstream = require( 'deepstream.io-client-js' );
const AuthService = require("./build/AuthService").default
//const AuthService = require("./AuthService");

const client = deepstream(process.env.DEEPSTREAM_HOST);
client.login(null);

var service = new AuthService(client);
//service.createUser({username: "test", email: "test", password:"test"})

service.login({identifier:"test",password:"test"}, function(token){
    console.log("Logged user in with token:",token)
})
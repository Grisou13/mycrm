require('dotenv').config()
const deepstream = require( 'deepstream.io-client-js' );

//const AuthService = require("./AuthService");
import AuthListener from './AuthListener'

const client = deepstream(process.env.DEEPSTREAM_HOST);
client.login(null);

const service = new AuthListener(client);
service.run();
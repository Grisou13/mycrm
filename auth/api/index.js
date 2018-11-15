const deepstream = require( 'deepstream.io-client-js' );

const client = deepstream(process.env.DEEPSTREAM_HOST);
client.login(null);

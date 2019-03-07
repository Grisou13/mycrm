require('dotenv').config()
const deepstream = require( 'deepstream.io-client-js' );
var mongoose = require('mongoose');

let BusinessListener;
if(process.env.NODE_ENV == 'production'){
    BusinessListener = require('./build/BusinessListener').default;
}else{
    BusinessListener = require('./src/BusinessListener').default;
}
const client = deepstream(process.env.EVENTHUB_HOST);
let listener = null;

try{
    let url = process.env.DB_URL;
    var lastChar = url.substr(-1); // Selects the last character
    if (lastChar != '/') {         // If the last character is not a slash
        url = url + '/';            // Append a slash to it.
    }
    url += process.env.DB_NAME
    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        client.login(null, (success, data) => {
            if (success) {
                console.log("Connected as ", data);
                listener = new BusinessListener(client, db);
                listener.run();
            } else {
                throw new Error("Unable to connect to deepstream")
            }
        })
    });
}catch(err){
    console.log(err);
}finally{
    if(listener != null)
        listener.close()
}

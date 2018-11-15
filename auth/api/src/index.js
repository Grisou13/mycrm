class AuthListener{
    constructor(client){
        
        this.attachCallbacks(client)
    }
    attachCallbacks(client){
        this.registerCallback(client, 'auth-user', ( data, response ) => {
            response.send( {
                token: this.auth.login(data),
                credential: data.identifier
            } );
        });
        this.registerCallback(client, 'generate-token', ( data, response ) => {
            response.send( {
                token: this.auth.generateToken(data),
                
            } );
        });
        this.registerCallback(client, 'validate-token', ( data, response ) => {
            response.send( {
                validity: this.auth.validate(data),
            } );
        });
        this.registerCallback(client, 'destroy-token', ( data, response ) => {
            response.send( {
                res: this.auth.unvalidate(data),
                
            } );
        });
    }
    registerCallback(client, name, cb){
        client.rpc.provide( `@${process.env.NAME}/${name}`, ( data, response ) => {
            cb(data,response)
        });
    }

    
}
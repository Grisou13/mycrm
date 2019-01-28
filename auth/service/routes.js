const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
export default (client) => {
    
    
    const app = express()
    app.use(bodyParser.json())
    app.post('/create-user', (req, res) => {
        
    })
    app.post('/login', (req, res) => {
        client.rpc.make( `${process.env.NAME}/auth-user`, req.body.authData, ( err, result ) => {
            if(!result.error){
                res.json(result)
            }
            res.status(403).end();
        });
      
    })
    app.get('/session', function (req, res) {
        var token = getCookie(req.headers.cookie, 'access_token');
        jwt.verify(token, 'abrakadabra', function(err, decoded) {
            if (err) {
              res.status(403).send('Not authenticated.');
            } else {
              res.json({
                token: token
              });
            }
          });
      });

      return app;
    
}


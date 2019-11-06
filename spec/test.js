const mod = require("./index")

//const spec = new mod.parser(__dirname+"/specs/auth-service.yaml");

mod.generate({
   to: "test_api/file",
   from: __dirname+"/specs/", 
   name: "file-service.yaml"
},
{
   api: true
})
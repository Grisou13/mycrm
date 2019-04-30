const mod = require("./index")

const spec = new mod.parser(__dirname+"/specs/signup-service.yaml");

mod.generate({
   to: "test_spec/",
   from: __dirname+"/specs/", 
   name: "signup-service.yaml"
})
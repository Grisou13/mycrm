const utils = require("utils");
  const modelcreateSignup = utils.rpc.Model;
  const validator = utils.validation.createValidator([{"name":"name","type":"string","validation":"required"}]);

const builder = utils.rpc.modelBuilder( validator, modelcreateSignup );


const action = async (ctx, next) => {
  const dataModel = builder(ctx)
  // do something with your model, like persist it to db
  // if(!dataModel) throw new ValidationError(dataModel.errors);
  // const model = require("./models/createSignup")
  // const newcreateSignup = new model(dataModel.toObj())
  return next();
}
module.exports = {
  path: "@Signup/createSignup",
  callback: action,
  schema: "rpc",
  method: "POST" //can be empty since an rpc action 
} 

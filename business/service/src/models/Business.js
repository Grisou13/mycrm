// export default class Business{
//     _id;
//     name;
//     activity_sectors;
//     owner_id;
//     employes = [];
//     clients = [];
//     products = [];
//     invites = [];

//     static build(data){
//         let business =  new Business()
//         business._id        = data._id || null;
//         return business;
//     }
    
// }

var mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    adress: String,
    npa: String,
    city: String,
})

const clientSchema = new mongoose.Schema({
  name: String,
  contact_adress: contactSchema,
  billing_adress: contactSchema
})

const roleSchema = new mongoose.Schema({
  name: String,
  actions:[String]
}) 

const emplyeeSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  role: roleSchema
})

var BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  employees: [emplyeeSchema],
  clients:[clientSchema],
});

var Business = mongoose.model('Business', BusinessSchema);

export default Business
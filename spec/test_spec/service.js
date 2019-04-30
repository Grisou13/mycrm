const utils = require("utils");
const ActioncreateSignup = require("./actions/createSignup.js");

const SignupService = new utils.rpc.Service("")

SignupService.addAction(ActioncreateSignup)


module.exports = SignupService
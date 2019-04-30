const utils = require("utils");

module.exports = (router) => {
    router.POST("Signup:createSignup", "/signup/", async (ctx, next) => {
        const res = validator.validate(ctx)
        if(res){
            ctx.body = await ctx.dispatch("rpc://@signup/CREATE-SIGNUP")
        }
        else{
            throw new utils.error.validationError(res)
        }
    })
}
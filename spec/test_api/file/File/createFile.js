const utils = require("utils");

module.exports = (router) => {
    router.POST("File:createFile", "/files/:id", async (ctx, next) => {
        const res = validator.validate(ctx)
        if(res){
            ctx.body = await ctx.dispatch("http://file-service/files/upload")
        }
        else{
            throw new utils.error.validationError(res)
        }
    })
}
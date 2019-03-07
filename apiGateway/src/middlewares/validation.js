export default (validations) => async (ctx, next) => {
    //get the ressource
    const validation = compose(validations)//get all validation necessery for this ressource
    const valid = validation(ctx.body)
    if(valid){
        return next();
    }
    throw new Error(402, valid.errors)
}
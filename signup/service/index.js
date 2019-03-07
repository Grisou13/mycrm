const service = new Service("signup")

//overload signup service
service.apply("@signup/CREATE_USER", async (ctx, next)=>{
    await next();//first validate request and user data
    ctx.service.dispatch("@auth/CREATE_USER", ctx.body);
})

service.loadSpec("./spec.yaml");

service.run();
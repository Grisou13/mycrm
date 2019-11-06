module.exports = async (args, opts, logger) => {
   const options = {
      target: path.resolve(args.to),
      specPath: path.resolve(args.from, args.name),
      createApiRoutes: !!opts.api,
   };
   
}

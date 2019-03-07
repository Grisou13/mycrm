const fs = require('fs-extra-promise');
const path = require('path');
const mustache = require('mustache');

const render = (path, options, dest) => {
    // Paths
    const sourcePath = path.resolve(path);
    //const distFile = mustache.render(file, options).replace('.mustache', '.js');
    const distPath = path.resolve(dest);

    // Read & render
    const template = await fs.readFileAsync(sourcePath, 'utf8');
    const sourceCode = mustache.render(template, options);

    // Write file
    if (sourceCode) {
        await fs.writeFileAsync(distPath, sourceCode);
    }
}

module.exports = async (args,opts,logger) => {
    const options = {
        target: path.resolve(args.path, args.name),
        specName: args.name,
        
      };
    const spec = new spec(options.specName);
    const name = spec.getName();
    // Create directory
    await fs.mkdirAsync(options.target);
    
    //create the base service
    render(path.resolve(templatesDir,"service.mustache"), spec, path.resolve(options.target, "service.js"));

    //create actions
    spec.getActions().forEach( (action) => {
        let dist = path.resolve(options.target, "actions", action.name+".js");
        render( path.resolve(templatesDir,"action.mustache"), action, dist )
    })
    
    //create models
}
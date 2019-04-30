const fs = require('fs-extra-promise');
const path = require('path');
const mustache = require('mustache');
const Parser = require("./spec")

const templatesDir = path.resolve(__dirname, "./models")

const render = async (sourcePath, options, distPath) => {
    // Paths
    // const sourcePath = path.resolve(path);
    //const distFile = mustache.render(file, options).replace('.mustache', '.js');
    // const distPath = path.resolve(dest);

    // Read & render
    const template = await fs.readFileAsync(sourcePath, 'utf8');
    const sourceCode = mustache.render(template, options);

    // Write file
    if (sourceCode) {
        await fs.writeFileAsync(distPath, sourceCode);
    }
}

const _templateFile = (serviceName) => path.resolve(templatesDir,serviceName+".mustache")

const createService = (spec, target) => {
    console.log(spec)
    render(_templateFile("service"), spec, path.resolve(target, "service.js"));
}

const createAction = (spec, target) => {
    render(_templateFile("action"), spec, target);
}

const createDataModel = (spec, target) => {
    render(_templateFile("dataModel"), spec, target);
}

const createUrl = (spec, target) => {
    render(_templateFile("url"), spec, target);
}

const createMain = (spec, target) => {
    render(_templateFile("main"), spec, path.resolve(target, "main.js"));
}
const createEnv = (spec, target) => {
    render(_templateFile("env"), spec, path.resolve(target, ".env"));
}


const mkdir = async (path) => {
    try {
        await fs.mkdirAsync(path);
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

module.exports = async (args,opts,logger) => {
    const options = {
        target: path.resolve(args.to),
        specName: args.name,
        specPath: path.resolve(args.from, args.name)
    };
    const spec = new Parser(options.specPath).toObj();
    // Create directory
    mkdir(options.target)

    //create the base service
    createService(spec, options.target);
    createMain(spec, options.target)
    createEnv(spec, options.target)
    //create actions
    mkdir(path.resolve(options.target, "actions"))
    spec.actions.forEach( (action) => {
        let dist = path.resolve(options.target, "actions", action.name+".js");
        createAction( action, dist )
    })
    
    //create models
    mkdir(path.resolve(options.target, "dataModels"))
    spec.dataModels.forEach( (model) => {
        let dist = path.resolve(options.target, "dataModel", model.name+".js");
        createDataModel(action, dist)
        // render( path.resolve(templatesDir,"action.mustache"), action, dist )
    })

    //create models
    mkdir(path.resolve(options.target, "urls"))
    spec.urls.forEach( (url) => {
        let dist = path.resolve(options.target, "urls", url.name+".js");
        createUrl(url, dist)
        // render( path.resolve(templatesDir,"action.mustache"), action, dist )
    })
}
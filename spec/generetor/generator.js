const fs = require('fs-extra-promise');
const path = require('path');
const mustache = require('mustache');
const Parser = require("./spec")

const templatesDir = path.resolve(__dirname, "templates")

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
        await fs.promises.mkdir(path, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

module.exports = async (options) => {
    
    const spec = new Parser(options.specPath).toObj();
    // Create directory
    mkdir(options.target)
    if(options.createApiRoutes){
        //create urls
        mkdir(path.resolve(options.target, spec.service.name))
        spec.urls.forEach( (url) => {
            let dist = path.resolve(options.target, spec.service.name, url.name+".js");
            createUrl(url, dist)
            // render( path.resolve(templatesDir,"action.mustache"), action, dist )
        })
        return;
    }
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
        let dist = path.resolve(options.target, "dataModels", model.name+".js");
        createDataModel(model, dist)
        // render( path.resolve(templatesDir,"action.mustache"), action, dist )
    })

    
}
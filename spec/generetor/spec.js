const yaml = require('js-yaml');
const fs   = require('fs');
var path = require('path');

const schemaRegex = /(.*)(?::\/\/)(.*$)/gm;
const httpSchema = /(GET|POST|PUT|PATCH|DELETE)(.*)(?::\/\/)(.*$)/gm;

class Spec{
    
    static actionOptions = {
        name: null,
        model: "",
        fields: [],
        method: "GET",
        internal: false,
        url: "",
        path: "",
        
    }

    constructor(path_){
        console.log("Loading path:", path_)
        this.spec = Spec.parseSpec(path_)
        this.service = this.getService();
    }
    static parseSpec(path_){
        var doc;
        let ext = path.extname(path_)
        if(ext == ".yaml"){
            doc = yaml.safeLoad(fs.readFileSync(path_, 'utf8'));
        }
        else if(ext = ".json"){
            doc = require(path_)
        }
        return doc
    }
    
    getApiUrls(){
        return this.spec.actions.map( (action) => {
            return {
                path: this.spec.path + "/" + action.path,
                name: this.spec.name + ":" + action.name,
                method: action.method,
                url: action.url,
                baseUrl: this.spec.path,
            }
        })
    }
    getSchema(url){
        let res = schemaRegex.exec(url)
        let schema = res.result[1];
        let method = null;
        if(schema.trim() != "rpc"){
            res = httpSchema.exec(url)
            method = res[1]
            schema = res[2]
        }
        return {
            method,
            schema,
            url
        }
    }
    buildInternalPathForAction(schema, specName, name, version){
        let str = "";
        if(schema == "rpc"){
            str += "@";
        }
        str += `${specName}/${name}`
        if(version != null){
            str += `/${version}`
        }
        return str;
    }
    getActions(){
        return this.specs.actions.map((action)=>{
            let res = this.schemaRegex.exec(url)
            let schema = res.result[1];            
            return {
                name: action.name,
                path: this.buildInternalPathForAction(schema, this.spec.name, action.name, action.version),
                model: action.model,
                fields: action.fields ? action.fields : null,
                schema,
                method : action.method,
            }
        })
    }
    getService(){
        return {
            name: this.spec.name,
        }
    }
    getDataModels(){
        return this.spec.models;
    }
    toObj(){
        return {
            service: this.getService(),
            actions: this.getActions().map(action => {
                return {...action,
                    "model?": action.model != null ? {
                        model: action.model
                    } : null,
                    "fields?": action.fields != null?{
                        fields: action.fields,
                        name: action.name,
                    }:null,
                    "isRpc?": action.schema == "rpc",
                }
            }),
            urls: this.getApiUrls(),
            dataModels: this.getDataModels(),
        }
    }
}



module.exports = Spec;
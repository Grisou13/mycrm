const router = require('koa-router')();
const yaml = require('js-yaml');
const fs   = require('fs');
var path = require('path')


class Spec{
    constructor(router){
        this.specs = {}
        this.router = router;
    }
    static parseSpec(path_){
        var doc;
        let ext = path.extname(path_)
        if(ext == ".yaml"){
            doc = yaml.safeLoad(fs.readFileSync(path_, 'utf8'));
        }
        if(ext = ".json"){
            doc = require(path_)
        }
        return doc
    }
    load(){
        fs.readdir(__dirname, function(err, items) {
            console.log(items);
            
            for (var i=0; i<items.length; i++) {
                if( items[i] != "parser.js"){
                    try {
                        this.addSpec(Spec.parseSpec(__dirname + "/" + items[i]))
                        console.log(doc);
                      } catch (e) {
                        console.log(e);
                      }
                }
            }
        });
    }
    addSpec(spec){
        this.specs[spec.name] = spec
    }
    getUrls(name){
        return this.specs[name].actions.reduce( (acc, cur) => {
            acc.push({path: cur.path, name: cur.name, method: cur.method})
            return acc
        },[]).map( (v) => {
            return this.specs[name].path+v
        })
    }
    getActions(){
        Object.keys(this.specs).reduce((acc, cur)=>{
            acc.concat(this.specs[cur].actions.map( (action) => this.specs[cur].name + ":" + action.name))
            return acc;
        },[])
    }
    get(url){
        //build exact url from spec definition
        //get everything from this bitch with validation fields
    }
    middlewareForAction(actionName){
        
    }
    handleAction(specName, actionName){
        const fields = this.sepcs[specName].actions.find( v => v.name == actionName).fields;

        return async (ctx, next) => {
            const res = await this.validate(ctx, fields)
            if(!res.ok){
                throw new Error("Validation error");
            }



        }
    }
    addActionToRouter(spec){
        const urls = this.getUrls(spec.name)
        urls.forEach( (url) => {
            router[url.method.toLowerCase()](url.name, url.path, this.handleAction(spec.name, url.name))
        })
    }
}




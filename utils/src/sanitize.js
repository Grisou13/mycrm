var SqlString = require('sqlstring');
var MongoSanitize = require('mongo-sanitize');

export function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const sanitize = (obj) => {
    return Object.keys(obj).reduce( (acc, k) => {
        let val = obj[k];
        switch(typeof val){
            case "object":
                val = sanitize(val);
            break;
            default:
                val = htmlEntities(val);
                val = SqlString.escape(val);
                val = MongoSanitize(val);
            break;
        }
        acc[k] = val;
        
        return acc;
    }, Array.isArray(obj) ? [] : {})
}
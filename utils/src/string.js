export const prefixObject = (obj, prefix) => 
    Object.keys(obj).reduce( (acc, key) => {
        
        Object.assign(acc,{
            [key]:`@${prefix}/${obj[key]}`
        })
        return acc;
    },{})
    
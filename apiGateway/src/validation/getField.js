export const getField = (params) => (ctx, next) => {
    //by default a field will be in the body, if not otherwise described
    const searchable = typeof params.in != "undefined" ? ctx[params.in] : ctx["body"];
    return searchable[params.name]; //return the valu of the field
}
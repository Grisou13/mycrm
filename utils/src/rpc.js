export const wrapEmmiter = (client, ctx) => {
    return (name,data) => {
        client.rpc.make(name, wrapData(data,ctx))
    }
}

export const wrapData = (data, ctx) => {
    return Object.assign({}, {payload:data}, {XREQUEST: ctx.req} )
}

export const unWrapData = (data) => {
    const req = data.XREQUEST;
    delete data.XREQUEST;
    return {
        payload: data.payload,
        request: req
    }
}

export const wrapReceiver = (client) => {   
    return (name, cb) => {
        const func = ( d, response ) => {
            const data = unWrapData(d);
            cb(data.payload, data.request ,response)
        }
        client.rpc.provide(name, func)
    }
}
const pathToRegexp = require('path-to-regexp')


export class HttpBus{
    constructor(app){
        this.client = app.httpClient;
    }
    send(url, requestData){
        console.log(url);
        const toPath = pathToRegexp.compile(url)

        this.client.request({
            params: requestData.query,
            url: toPath(requestData.params),
            method: requestData.method,
            headers: requestData.headers,
            data: requestData.body,
        })
    }
}

export default HttpBus;
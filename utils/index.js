require('babel-register');
if (!global._babelPolyfill && !window._babelPolyfill) { 
    require("babel-polyfill");
}
module.exports = require("./build").default
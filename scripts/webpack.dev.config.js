const config = require('./webpack.config');
const path = require('path');

let devConfig = Object.assign(config, {
    mode: 'development',
    entry: path.join(__dirname, '../src/index.js'),
    output: {
        filename: 'webglRenderEngine.js',
        path: path.join(__dirname, '../build'),
        library: 'webglRenderEngine',
        libraryTarget: 'umd'
    }
});

module.exports = devConfig;
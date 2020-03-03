const config = require('./webpack.config');
const path = require('path');

let proConfig = Object.assign(config, {
    mode: 'production',
    entry: path.join(__dirname, '../src/index.js'),
    output: {
        filename: 'webglRenderEngine.min.js',
        path: path.join(__dirname, '../build'),
        library: 'webglRenderEngine',
        libraryTarget: 'umd'
    }
});

module.exports = proConfig;
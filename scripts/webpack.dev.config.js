const config = require('./webpack.config');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let findEntries = function(dir) {
    let paths = fs.readdirSync(dir),
        entries = {};

    for(let i = 0, l = paths.length; i < l; i++) {
        let p = path.join(dir, paths[i]),
            extname = path.extname(p);
        if (extname === '' && fs.statSync(p).isDirectory()) {
            let subEntries = findEntries(p);
            for (let name in subEntries) {
                entries[name] = subEntries[name];
            }
        } else if(extname === '.html') {
            let basename = path.basename(p, extname);
            entries[basename] = {
                name: basename,
                html: path.format({
                    dir,
                    name: basename,
                    ext: '.html'
                }),
                js: path.format({
                    dir,
                    name: basename,
                    ext: '.js'
                })
            };
        }
    }

    return entries;
}

let devConfig = Object.assign(config, {
    mode: 'development',
    devServer: {
        contentBase: './dist'
    },
    entry: {}
});

let entries = findEntries(path.join(__dirname, '../examples'));
for (let name in entries) {
    let entry = entries[name];
    devConfig.entry[name] = entry.js;
    devConfig.plugins.push(
        new HtmlWebpackPlugin({
            filename: name + '.html',
            template: entry.html,
            chunks: [name]
        })
    );
}

module.exports = devConfig;
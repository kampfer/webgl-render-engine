const config = require('./webpack.config');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let devConfig = Object.assign(config, {
    mode: 'development',
    entry: {
        main: path.join(__dirname, '../src/assets/main')
    },
    devServer: {
        contentBase: './dist'
    }
});

devConfig.plugins.push(
    new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
    })
);

devConfig.module.rules.push({
    test: /\.less$/i,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: true,
            },
        },
        'css-loader',
        'less-loader'
    ],
}, {
    test: /\.(png|jpg|gif)$/i,
    use: [
        {
            loader: 'url-loader',
            options: {
                limit: 8192,
            },
        },
    ],
});

module.exports = devConfig;
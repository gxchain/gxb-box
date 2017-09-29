const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');

fs.open('./src/config/env.js', 'w', function(err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    entry: {
        main: ['./src/main','webpack-hot-middleware/client'],
        vendors: ['./src/vendors','webpack-hot-middleware/client']
    },
    output: {
        publicPath: '/',
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.(gif|jpg|png|svg)\??.*$/,
                loader: 'url-loader?limit=1024&name=static/img/[name].[ext]'
            },
            {
                test: /\.(woff|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024&name=static/fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'static/css/[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'static/js/vendors.js'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin,
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/template/index.ejs',
            inject: false
        })
    ]
});
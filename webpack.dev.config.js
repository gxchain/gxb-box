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
        main: ['./src/main','webpack-hot-middleware/client?reload=true'],
        vendors: ['./src/vendors']
    },
    output: {
        publicPath: '/',
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js'
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
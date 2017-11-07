var webpack = require('webpack');
var fs = require('fs');
var path = require('path');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: ['../lib/index.js'],
    output: {
        path: path.resolve(__dirname, '../server-box-dist'),
        filename: 'gxb-box.js'
    },
    target: 'node',
    externals: nodeModules,
    context: __dirname,
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: [
                path.resolve(__dirname, "../node_modules")
            ],
            query: {
                plugins: ['transform-runtime'],
                presets: ['es2015', 'stage-2'],
            }
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     exclude: /\.min\.js$/,
        //     mangle: true,
        //     output: {comments: false},
        //     compress: {warnings: false}
        // })
    ]
}
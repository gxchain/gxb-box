const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        main: './src/main',
        vendors: './src/vendors'
    },
    output: {
        path: path.join(__dirname, './dist'),
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        sass: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use: ['css-loader?minimize', 'autoprefixer-loader', 'sass-loader'],
                            fallback: 'vue-style-loader'
                        })),
                        css: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use: ['css-loader', 'autoprefixer-loader'],
                            fallback: 'vue-style-loader'
                        }))
                    }
                }
            },
            {
                test: /iview\/.*?js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', 'autoprefixer-loader'],
                    fallback: 'style-loader'
                }))
            },
            {
                test: /\.sass/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use: ['autoprefixer-loader', 'sass-loader'],
                    fallback: 'style-loader'
                }))
            },
            {
                test: /\.(gif|jpg|png|svg)\??.*$/,
                loader: 'url-loader?limit=1024'
            },
            {
                test: /\.(woff|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024'
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', 'css'],
        alias: {
            'vue': 'vue/dist/vue.esm.js'
        }
    }
};
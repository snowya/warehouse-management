const { resolve } = require('path')
const r = (path) => resolve(__dirname, path)
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { emitWarning } = require('process')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'built.js',
        path: r('dist')
    },
    resolve: {
        extensions: ['.vue', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    r('src')
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                // convert to base64
                loader: 'url-loader',
                options: {
                  limit: 15000,
                  outputPath: 'font'
                }
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    devServer: {
        open: true,
        quiet: true,
        clientLogLevel: 'warning',
        hot: true,
        port: '3000'

    }
}
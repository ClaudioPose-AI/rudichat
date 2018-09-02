const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//const modeDev = process.env.NODE_ENV !== 'production'
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

// Novo
//var nodeExternals = require('webpack-node-externals');

module.exports = {

//    mode: 'production',
    mode: 'development',
// ADD package JSON - //"build": "cross-env NODE_END=production webpack"
//    mode: modeDev ? 'development': 'production',

    entry : {
        app: './src/app.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js'
    },
    output : {

        filename : '[name].bundle.js',
        path : path.resolve(__dirname, 'dist'),
//        libraryTarget : 'this' //Novo
        //publicPath : __dirname+'/dist/'
    },

//    target: 'node', // Novo

    devServer: {
        contentBase: "./dist",
        port: 8080
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true
            }),
            new OptimizeCSSAssetsPlugin({
            })
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.css"
        })
    ],
    module: {
        rules: [{
            test: /\.s?[ac]ss$/,
            use: [
                //{
                //   loader: MiniCssExtractPlugin.loader,
                //   options: {
                //    path : path.join(__dirname, 'dist'),
                //    publicPath : 'dist'
                //}},
                MiniCssExtractPlugin.loader,
                //'style-loader', // Adiciona o CSS a DOM
                'css-loader', // Interpreta o CSS ( Comandos CSS )
                'sass-loader'   
            ]

                //'webp-loader'            
        },{
            test: /\.(png|svg|jpg|gif|webp|jpeg)$/i,
            use: [
                'file-loader',
                'webp-loader'
            ]
        },{
            test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
        }
    ]
    },

    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ]
    },

//    externals: [nodeExternals()] // <-- Important - Novo
}
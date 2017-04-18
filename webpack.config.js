const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProd = process.env.NODE_ENV === 'production'; // true or false
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'sass-loader'],
  publicPath: '/dist'
})
const cssConfig = isProd ? cssProd : cssDev

module.exports = {
  entry: {
    app: './src/scripts/main.js',
    contact: './src/scripts/contact.js'
  },
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: cssConfig
    }, {
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.pug$/,
      use: 'pug-loader'
    }, {
      test: /\.(jpe?g|png|svg|gif)$/i,
      use: [
        'file-loader?name=img/[name].[ext]',
        // 'file-loader?name=[name].[ext]&outputPath=img/&publicPath=img/',
        // 'image-webpack-loader',
        {
          loader: 'image-webpack-loader',
          options: {}
        }
      ]
    }, {
      test: /\.(woff2?|svg)$/,
      use: 'url-loader?limit=10000&name=fonts/[name].[ext]'
    }, {
      test: /\.(tff|eot)$/,
      use: 'file-loader?name=fonts/[name].[ext]'
    }]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    // port: 9000,
    stats: 'errors-only',
    hot: true,
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Thomas Vallez',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      excludeChunks: ['contact'],
      // filename: './../index.html',
      // template: './src/index.html' // Load a custom template (ejs by default see the FAQ for details)
      template: './src/templates/index.pug'
    }),
    new HtmlWebpackPlugin({
      title: 'Contact Page',
      // minify: {
      //   collapseWhitespace: true
      // },
      hash: true,
      chunks: ['contact'],
      filename: 'templates/contact.pug',
      template: './src/templates/contact.pug'
    }),
    new ExtractTextPlugin({
      filename: './css/[name].css',
      disable: !isProd,
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    // Make sure this is after ExtractTextPlugin!
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'src/templates/*.pug')),
    })
  ]
}

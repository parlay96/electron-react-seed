/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-12 15:37:32
 * @Description: 渲染进程配置
 */
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const moduleFederation = require('./module-federation')
const scssLoader = require('./scss-loader')
const utils = require('../utils')

const IsWeb = process.env.BABEL_ENV === 'web'

let rendererConfig = {
  infrastructureLogging: { level: 'warn' },
  entry: {
    renderer: utils.resolve('src/renderer/index.tsx')
  },
  resolve: {
    alias: {
      '@': utils.resolve('src/renderer'),
      '@config': utils.resolve('config'),
    },
    extensions: ['.tsx', ".js", '.ts', '.json', '.scss', '.css']
  },
  target: IsWeb ? 'web' : 'electron-renderer',
  module: {
    rules: [
      ...scssLoader,
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: "asset/resource",
        generator: {
          filename: utils.assetsPath('imgs/[name]--[hash].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: "asset/resource",
        generator: {
          filename: utils.assetsPath('media/[name]--[hash].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: "asset/resource",
        generator: {
          filename: utils.assetsPath('fonts/[name]--[hash].[ext]')
        }
      },
      {
        test: /\.ts[x]?$/,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          IsWeb ?
          // esbuild-loader打包速度快，但是在web上可能有些浏览器不兼容
          { loader: 'babel-loader', options: { cacheDirectory: true } }
          :
          { loader: 'esbuild-loader', options: { loader: 'tsx' } }
        ]
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:8].css',
      chunkFilename: utils.assetsPath('css/[id].[chunkhash:8].css')
    }),
    new webpack.DefinePlugin({
      'process.env.IS_WEB': IsWeb,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__static': `"${path.join(__dirname, '../../static').replace(/\\/g, '\\\\')}"`,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: utils.resolve('src/index.html'),
      minify: {
        removeComments: true,//移除注释
        collapseWhitespace: true, //合并多余空格
        removeAttributeQuotes: true//移除分号
      }
    }),
    ...moduleFederation,
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

module.exports = rendererConfig

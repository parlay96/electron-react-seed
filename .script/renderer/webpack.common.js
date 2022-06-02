/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-02 10:50:03
 * @Description: 渲染进程配置
 */
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const moduleFederation = require('./module-federation')
const scssLoader = require('./scss-loader')
const utils = require('../utils')

const IsWeb = process.env.BUILD_TARGET === 'web'

let rendererConfig = {
  infrastructureLogging: { level: 'warn' },
  entry: {
    renderer: utils.resolve('src/renderer/index.tsx')
  },
  output: {
    path: IsWeb ? utils.resolve('dist/web'): utils.resolve('dist/electron'),//输出文件夹
    filename: utils.assetsPath('js/[name].[chunkhash:8].js'),//输出文件命名规则
    chunkFilename: utils.assetsPath('js/[id].[chunkhash:8].js'), // 此选项决定了非初始（non-initial）chunk 文件的名称。
  },
  resolve: {
    alias: {
      '@': utils.resolve('src/renderer'),
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
      filename: utils.assetsPath('css/[name].[chunkhash:8].css'),
      chunkFilename: utils.assetsPath('css/[id].[chunkhash:8].css')
    }),
    new webpack.DefinePlugin({
      'process.env.IS_WEB': IsWeb,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
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

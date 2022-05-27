/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: penglei
 * @LastEditTime: 2022-05-26 19:47:13
 * @Description: 主进程配置
 */

const path = require('path')
const webpack = require('webpack')
const utils = require('./utils')
const { dependencies } = require('../package.json')


process.env.BABEL_ENV = 'main'

let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.ts')
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  resolve: {
    alias: {
      '@config': utils.resolve('config'),
    },
    extensions: ['.ts', '.js', '.node']
  },
  // https://webpack.docschina.org/configuration/target/
  target: 'electron-main',
  externals: [
    ...Object.keys(dependencies || {})
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'ts'
        }
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  // https://webpack.docschina.org/configuration/node/#node__filename
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: []
}

/**
 * 调整开发设置的mainConfig
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = mainConfig

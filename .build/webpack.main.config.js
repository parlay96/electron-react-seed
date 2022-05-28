/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: pl
 * @LastEditTime: 2022-05-28 11:40:45
 * @Description: 主进程配置
 */

const path = require('path')
const webpack = require('webpack')
const utils = require('./utils')
const TerserPlugin = require('terser-webpack-plugin')
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
    extensions: ['.ts', '.js']
  },
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
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  optimization: {
    minimize: true, // 插件压缩
    minimizer: [
      new TerserPlugin({ // 压缩js
        test: /\.js($|\?)/i,
        terserOptions: {
          compress: {
            drop_console: true, // 去掉console
            drop_debugger: true, // 去掉debugger
          },
        },
        parallel:  true,
      }),
    ]
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

/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: pl
 * @LastEditTime: 2022-05-30 16:52:45
 * @Description: 主进程配置
 */
const utils = require('../utils')
const { dependencies } = require('../../package.json')

module.exports = {
  entry: {
    main: utils.resolve('src/main/index')
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: utils.resolve('dist/electron')
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
  }
}

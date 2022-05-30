/*
 * @Author: pl
 * @Date: 2022-05-30 10:48:17
 * @LastEditors: pl
 * @LastEditTime: 2022-05-30 16:49:32
 * @Description: file content
 * @FilePath: \yp-electron\.script\main\webapck.dev.js
 */
const { merge } = require('webpack-merge')
const webpackConfig = require('./webpack.common')

module.exports = merge(webpackConfig, {
  mode: 'development'
})

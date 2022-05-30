/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: pl
 * @LastEditTime: 2022-05-30 16:49:49
 * @Description: 主进程配置
 */
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

const webpackConfig = require('./webpack.common')

module.exports = merge(webpackConfig, {
  mode: 'production',
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ]
})

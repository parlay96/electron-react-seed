/*
 * @Author: pl
 * @Date: 2022-05-30 15:58:45
 * @LastEditors: pl
 * @LastEditTime: 2022-05-30 16:05:25
 * @Description: file content
 * @FilePath: \yp-electron\.build\build-web.js
 */
const webpack = require('webpack')
const chalk = require('chalk')
const { greeting, clean } = require('./utils')
const rendererConfig = require('./renderer/webpack.prod')

// web打包
async function web() {
  await greeting()
  await clean('web')
  rendererConfig.mode = 'production'
  webpack(rendererConfig, (err, stats) => {
    if (err || stats.hasErrors()) console.log(err)
    console.log(stats.toString({
      chunks: false,
      colors: true
    }))
    console.log(`${chalk.yellow.bgRed('---------------打包完成---------------')}\n`)
    process.exit()
  })
}

web()

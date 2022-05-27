/*
 * @Author: penglei
 * @Date: 2022-05-25 20:47:23
 * @LastEditors: penglei
 * @LastEditTime: 2022-05-27 11:15:27
 * @Description: 打包脚本
 */
// 当前环境
process.env.NODE_ENV = 'production'

const del = require('del')
const webpack = require('webpack')
const chalk = require('chalk')
const Multispinner = require('multispinner')

const { greeting } = require('./utils')
const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

// 删除文件
async function clean() {
  if (process.env.BUILD_TARGET === 'web') {
    // 删除web目录
    del.sync(['dist/web'])
  } else {
    // 除了web不删除，其他都删除
    del.sync(['dist/*', '!dist/web'])
  }
}

// 打包
async function build() {
  await greeting()
  await clean()

  const tasks = ['main', 'renderer']
  // https://www.npmjs.com/package/multispinner
  const m = new Multispinner(tasks, {
    preText: 'building',
    postText: 'process'
  })
  let results = ''
  m.on('success', () => {
    process.stdout.write('\x1B[2J\x1B[0f')
    console.log(`\n\n${results}`)
    console.log(`${chalk.yellow.bgRed('---------------编译完成, 开始electron-builder输出产物, 请耐心等待---------------')}\n`)
    // 结束之前编译的进程，
    process.exit()
  })

  pack(mainConfig).then(result => {
    results += result + '\n\n'
    m.success('main')
  }).catch(err => {
    m.error('main')
    console.error(`\n${err}\n`)
    process.exit(1)
  })

  pack(rendererConfig).then(result => {
    results += result + '\n\n'
    m.success('renderer')
  }).catch(err => {
    m.error('renderer')
    console.error(`\n${err}\n`)
    process.exit(1)
  })
}

// 包裹
function pack(config) {
  return new Promise((resolve, reject) => {
    config.mode = 'production'
    // https://webpack.docschina.org/api/node#webpack
    webpack(config, (err, stats) => {
      if (err) reject(err.stack || err)
      else if (stats.hasErrors()) {
        reject(err)
      } else {
        resolve(stats.toString({
          chunks: false,
          colors: true
        }))
      }
    })
  })
}

// web打包
async function web() {
  await clean()
  rendererConfig.mode = 'production'
  webpack(rendererConfig, (err, stats) => {
    if (err || stats.hasErrors()) console.log(err)
    console.log(stats.toString({
      chunks: false,
      colors: true
    }))
    console.log(`${chalk.yellow.bgRed('---------------编译完成---------------')}\n`)
    process.exit()
  })
}

// 如果是打web包，和exe应用
if (process.env.BUILD_TARGET === 'web') web()
else build()

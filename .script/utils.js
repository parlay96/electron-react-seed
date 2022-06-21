/*
 * @Author: penglei
 * @Date: 2022-05-26 16:21:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-21 11:13:56
 * @Description:
 */
// https://www.npmjs.com/package/cfonts
const { say } = require('cfonts')
const del = require('del')
const chalk = require('chalk')
const path = require('path')
const config = require('../config')
/**
 * 解析静态文件路径
 * @param _path
 */
exports.assetsPath = (_path) => {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
      ? config.build.assetsSubDirectory
      : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
 }

exports.resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}

exports.greeting = async () => {
  say('yu-pao', {
    colors: ['yellow'],
    font: 'simple3d',
    space: false
  })
}

exports.logStats = (proc, data) => {
  let log = ''
  if (data) {
      log += chalk.yellow.bold(`┏ ${proc} ${new Array((19 - proc.length) + 1).join('-')}`)
      log += '\n\n'

      if (typeof data === 'object') {
        data.toString({
          colors: true,
          chunks: false
        }).split(/\r?\n/).forEach(line => {
          log += '  ' + line + '\n'
        })
      } else if(data) {
        log += `  ${data}\n`
      }
      log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'
  } else {
    log = chalk.yellow.bold(`┏ ${proc} ${new Array((19 - proc.length) + 1).join('-')}`)
    log += '\n\n'
  }
  console.log(log)
}

// 删除文件
exports.clean = async function (TARGET) {
  if (TARGET === 'web') {
    // 删除web目录
    del.sync(['dist/web'])
  } else {
    // 除了web不删除，其他都删除
    del.sync(['dist/*', '!dist/web'])
  }
}

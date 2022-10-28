/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-28 14:14:49
 * @Description: 关于环境的配置，和主程序配置
 */

const menuWidth = 70 // 菜单栏宽度

// 是开发环境？
const isDev = process.env.NODE_ENV === 'development'

// 主窗口的最小宽度。 menuWidth桌面端左侧菜单栏的宽度
const mainWindowMinWidth = isDev ? 1500 : 890 + menuWidth

// 主窗口的最小高度
const mainWindowMinHeight = isDev ? 800 : 640

module.exports = {
  build: {
    assetsSubDirectory: 'static', // 复制静态资源到目录中。地址
  },
  dev: {
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 9080, // 开发环境的端口, pc是3000，不要冲突了
    assetsSubDirectory: 'static', // 复制静态资源到目录中。地址
    // 反向代理列表
    proxy: {
      '/api': {
        pathRewrite: {'^/api' : ''},
        target: 'http://gcgl.superinyang.com',
        changeOrigin: true, // target是域名的话，需要这个参数，
      }
    },
  },
  menuWidth,
  mainWindowMinWidth,
  mainWindowMinHeight,
  UseStartupChart: false, // 是否需要启动页面
  IsUseFrame: false, // false代表无边框窗口
  IsSingleInstances: true, // 是否单例模式
  IsMaximize: false, // 是否需要初始化最大窗口模式
  IsInitTray: true, // 是否启动应用的时候就创建托盘
  IsBuildTools: true, // 线上环境是否需要调试器，有可能本地测试打包后需要开启调试器
  IsInitMenu: true, // 是否初始化菜单栏
}

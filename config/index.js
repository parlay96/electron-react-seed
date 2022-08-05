/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-01 18:22:58
 * @Description: 关于环境的配置，和主程序配置
 */
const menuWidth = 70 // 菜单栏宽度

// 如果是开发环境还要算上调试器的宽度
const isDev = process.env.NODE_ENV === 'development'
// 主窗口的最小宽度。默认就是1207（7是滚动条的宽度）是工程云web网页的最小宽，menuWidth桌面端左侧菜单栏的宽度
const mainWindowMinWidth = isDev ? 1207 + 300 : 1207 + menuWidth
// 主窗口的最小高度
const mainWindowMinHeight = isDev ? 800 : 645

module.exports = {
  build: {
    assetsSubDirectory: 'static', // 复制静态资源到目录中。地址
  },
  dev: {
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 9080, // 开发环境的端口, pc是3000，不要冲突了
    assetsSubDirectory: 'static', // 复制静态资源到目录中。地址
    proxy: {
      '/api': {
        pathRewrite: {'^/api' : ''},
        target: 'http://gcgl.superinyang.com',
        changeOrigin: true, // target是域名的话，需要这个参数，
      }
    }, // 反向代理
  },
  mainWindowMinWidth,
  menuWidth,
  mainWindowMinHeight,
  UseStartupChart: false, // 是否需要启动页面
  IsUseFrame: false, // false代表无边框窗口
  IsMaximize: false, // 是否需要初始化最大窗口模式
}

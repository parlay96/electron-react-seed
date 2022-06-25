/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-25 14:03:38
 * @Description: 关于环境的配置，和主程序配置
 */
module.exports = {
  build: {
    assetsSubDirectory: 'static', // 复制静态资源到目录中。地址
  },
  dev: {
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 9080, // 开发环境的端口, pc是3000，不要冲突了
    assetsSubDirectory: 'static', // 复制静态资源到目录中。地址
    proxy: {}, // 反向代理
  },
  // 主窗口的最小宽度。默认就是1207（7是滚动条的宽度）是工程云web网页的最小宽，74是桌面端左侧菜单栏的宽度
  mainWindowMinWidth: 1207 + 74,
  mainWindowMinHeight: 645, //  主窗口的最小高度
  UseStartupChart: false, // 是否需要启动页面
  IsUseFrame: false, // false代表无边框窗口
  IsMaximize: false, // 是否需要初始化最大窗口模式
}

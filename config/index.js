/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: pl
 * @LastEditTime: 2022-05-30 17:54:12
 * @Description: 关于环境的配置，和主程序配置
 */
module.exports = {
  build: {
    DisableF12: true, // f12开控制台
    assetsSubDirectory: 'static', // 复制静态资源到目录中。地址
  },
  dev: {
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 9080, // 开发环境的端口, pc是3000，不要冲突了
    assetsSubDirectory: 'static', // 复制静态资源到目录中。地址
    proxy: {}, // 反向代理
  },
  UseStartupChart: false, // 是否需要启动页面
  IsUseSysTitle: true, // false代表无边框窗口
  IsMaximize: false, // 是否需要初始化最大窗口模式
}

/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-23 17:48:40
 * @Description: 主进程入口
 */
import { app } from 'electron'
import mainInit from './services/main-init'
import DisableButton from './config/disable-button'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'

function onAppReady () {
  new mainInit()
  DisableButton.Disablef12()
  if (process.env.NODE_ENV === 'development') {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`已安装 ${name}`))
      .catch(err => console.log(`无法安装: \n 可能发生得错误：网络连接问题 \n`, err))
  }
}

// Electron 已完成初始化? https://www.electronjs.org/zh/docs/latest/api/app#事件-ready
app.isReady() ? onAppReady() : app.on('ready', onAppReady)
// 由于9.x版本问题，需要加入该配置关闭跨域问题
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')

// https://www.electronjs.org/zh/docs/latest/api/app#事件-window-all-closed
app.on('window-all-closed', () => {
  // 所有平台均为所有窗口关闭就退出软件
  app.quit()
})

// 在创建新的 browserWindow 时触发
app.on('browser-window-created', () => {
  console.log('window-created')
})

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.removeAsDefaultProtocolClient('yupao')
    console.log('有于框架特殊性开发环境下无法使用')
  }
} else {
  app.setAsDefaultProtocolClient('yupao')
}

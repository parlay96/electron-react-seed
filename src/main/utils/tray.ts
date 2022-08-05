/*
 * @Date: 2022-06-21 14:52:22
 * @Description: 托盘实例
 */
import { trayIcon } from '../config/static-path'
import { Menu, Tray, app } from 'electron'

let mainWindow = null
let appTray = null // 托盘实例

// 隐藏主窗口，并创建托盘
export const setTray = (window) => {
  if (!mainWindow) { mainWindow = window }
  // 判断是否存在托盘
  if (appTray && !appTray.isDestroyed()) {
    // 隐藏主窗口
    mainWindow.hide()
    // 启动或停止闪烁窗口, 以吸引用户的注意。
    mainWindow.flashFrame(true)
    return '已经创建过托盘'
  }
  // 当托盘最小化时，右击有一个菜单显示，这里进设置一个退出的菜单
  const trayMenuTemplate = [{ // 系统托盘图标目录
    label: '退出鱼泡工程云',
    click: function () {
      appTray = null
      mainWindow = null
      app.exit() // 点击之后退出应用
    }
  }]
  // 创建托盘实例
  appTray = new Tray(trayIcon)
  // 图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
  // 隐藏主窗口
  mainWindow.hide()
  // 启动或停止闪烁窗口, 以吸引用户的注意。
  mainWindow.flashFrame(true)
  // 设置托盘悬浮提示
  appTray.setToolTip('鱼泡工程云')
  // 设置托盘菜单
  appTray.setContextMenu(contextMenu)
  // 单机托盘小图标显示应用
  appTray.on('click', function () {
    // 显示主程序
    mainWindow.show()
    // 将窗口从最小化状态恢复到以前的状态
    mainWindow.restore()
    // // 关闭托盘显示
    // appTray.destroy();
  })
  return '创建完毕'
}

/*
 * @Date: 2022-06-23 17:06:22
 * @Description: 主窗口的ipc通信
 */
import { ipcMain, dialog, BrowserWindow, shell, app } from 'electron'
import { windowMoveIpc } from './common'

/** 主窗口的 ipc通信*/
export const ipcWinMain = (mainWindow: BrowserWindow) => {
  // 窗口拖动时
  windowMoveIpc(mainWindow, 'main-window-moving')
  // 最小化
  ipcMain.handle('windows-mini', () => {
    mainWindow.minimize()
  })
  // 取消最大化窗口
  ipcMain.handle('window-mix', async () => {
    mainWindow.unmaximize()
  })
  // 最大化窗口。如果尚未显示该窗口，它还将显示（但不聚焦）该窗口。
  ipcMain.handle('window-max', async () => {
    mainWindow.maximize()
  })
  // 关闭窗口
  ipcMain.handle('window-close', () => {
    mainWindow.close()
  })
  // 用浏览器打开需要访问的网页地址
  ipcMain.handle('open-external', (event, arg) => {
    shell.openExternal(arg)
  })
  // 隐藏窗口
  ipcMain.handle('window-hide', async () => {
    mainWindow.hide()
  })
  // 退出应用
  ipcMain.handle('quit-app', (event, arg)=>{
    // 所有窗口都将立即被关闭，而不询问用户
    app.exit() // 点击之后退出应用
  })
  // 消息弹窗
  ipcMain.handle('open-messagebox', async (event, arg) => {
    const res = await dialog.showMessageBox(mainWindow, {
      type: arg.type || 'info',
      title: arg.title || '',
      buttons: arg.buttons || [],
      message: arg.message || '',
      noLink: arg.noLink || true
    })
    return res
  })
  // 当窗口从最大化状态退出时触发
  mainWindow.on('unmaximize', (e) => {
    mainWindow.webContents.send('on-unmaximize', false)
  })
  // 窗口最大化时触发
  mainWindow.on('maximize', (e) => {
    mainWindow.webContents.send('on-maximize', true)
  })
}

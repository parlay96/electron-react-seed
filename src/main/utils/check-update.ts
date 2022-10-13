/*
 * @Date: 2022-08-29 10:15:47
 * @Description: 更新应用
 */
import { autoUpdater } from 'electron-updater'
import { ipcMain, BrowserWindow } from 'electron'
/**
 * -1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成
 **/
// 负责向渲染进程发送信息
function Message (mainWindow: BrowserWindow, type: number, data?: string) {
  const senddata = {
    state: type,
    msg: data || ''
  }
  mainWindow.webContents.send('update-msg', senddata)
}
// 更新应用的方法
export const updateApp = (mainWindow: BrowserWindow) => {
  // 在下载之前将autoUpdater的autoDownload属性设置成false，通过渲染进程触发主进程事件来实现这一设置(将自动更新设置成false)
  autoUpdater.autoDownload = false
  // 设置版本更新地址，即将打包后的latest.yml文件和exe文件同时放在
  // http://xxxx/test/version/对应的服务器目录下,该地址和package.json的publish中的url保持一致
  // https://www.electron.build/auto-update.html#appupdatersetfeedurloptions
  // package.json的publish配置了 这里可以不写
  // autoUpdater.setFeedURL({
  //   "provider": "generic",
  //   "url": "http://127.0.0.1:8000" // 下载新版文件的地址
  // })
  // 当更新发生错误的时候触发。
  autoUpdater.on('error', (err) => {
    Message(mainWindow, -1, '检测更新查询异常')
  })
  // 当开始检查更新的时候触发
  autoUpdater.on('checking-for-update', () => {
    Message(mainWindow, 0)
  })
  // 发现可更新数据时
  autoUpdater.on('update-available', (event) => {
    Message(mainWindow, 1)
  })
  // 没有可更新数据时
  autoUpdater.on('update-not-available', (event) => {
    Message(mainWindow, 2)
  })
  // 下载监听
  autoUpdater.on('download-progress', (progressObj: any) => {
    Message(mainWindow, 3, progressObj)
  })
  // 下载完成
  autoUpdater.on('update-downloaded', () => {
    Message(mainWindow, 4)
  })
  // 执行更新检查
  ipcMain.handle('check-update', () => {
    autoUpdater.checkForUpdates()
  })
  // 退出并安装
  ipcMain.handle('confirm-update', () => {
    autoUpdater.quitAndInstall()
  })

  // 手动下载更新文件
  ipcMain.handle('confirm-downloadUpdate', () => {
    autoUpdater.downloadUpdate()
  })
}


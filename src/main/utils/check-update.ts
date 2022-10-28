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
function Message (mainWindow: BrowserWindow, type: number, data?: any) {
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

  // 1. 本地测试，打包一个当前版本更高的。然后复制文件到根目录的server里面，在使用node-express启动服务。
  // 2. 在把package.json版本改回来，在打包。然后运行打包文件里面的exe文件，即可测试！

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
  autoUpdater.on('update-available', (info) => {
    Message(mainWindow, 1, info)
  })
  // 没有可更新数据时
  autoUpdater.on('update-not-available', (event) => {
    Message(mainWindow, 2)
  })

  // 下载监听, 如果已经下载了，但是没有安装，那么下次再次点击更新版本，这个方法会直接不执行了。直接走到了 下载完成
  // 下载进度，包含进度百分比、下载速度、已下载字节、总字节等
  // ps: 调试时，想重复更新，会因为缓存导致该事件不执行，下载直接完成，可找到C:\Users\40551\AppData\Local\xxx-updater\pending下的缓存文件将其删除（这是我本地的路径）

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


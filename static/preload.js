/*
 * @Author: penglei
 * @Date: 2022-07-10 19:08:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-11 15:01:33
 * @Description:
 */
//!! 重要文件 误删除
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require('electron')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ypTalkBridge } = require('@yp_cloud/common')

// 桥接
contextBridge.exposeInMainWorld(
  '_ypTalkApi',
  {
    ...ypTalkBridge(ipcRenderer),
    isMainFrame: process.isMainFrame
  }
)

// 给webview添加点击事件
document.addEventListener('click',function (e) {
  // 告诉主进程点击了页面
  ipcRenderer.send('web-view-click')
})

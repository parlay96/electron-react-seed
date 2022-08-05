/*
 * @Author: penglei
 * @Date: 2022-07-10 19:08:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-04 11:55:14
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

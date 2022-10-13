/*
 * @Date: 2022-09-20 18:59:21
 * @Description: 桌面端存储，会以文件方式存放本地磁盘
 */

import Store from 'electron-store'
const option = {
  name:"ypgcy-data",//文件名称,默认 config
  fileExtension:"json",//文件后缀,默认json
  clearInvalidConfig: true, // 发生 SyntaxError  则清空配置,
}
// console.log(app.getPath('userData'), 'Store=>存储的文件路径')
const electronStore = new Store(option)
export default electronStore

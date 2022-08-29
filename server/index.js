/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Date: 2022-08-29 15:35:08
 * @Description: 本地测试更新使用，启动本地服务
 */

const express = require('express')
const path = require('path')
const app = express()
// 下面在干嘛，你具体可看：https://www.jianshu.com/p/1d92463ebb69，大概加个路径文件
app.use(express.static(path.join(__dirname, './client')))

const server = app.listen(8000, function () {
  const host = server.address().address
  const port = server.address().port
  console.log('服务启动', host, port)
})

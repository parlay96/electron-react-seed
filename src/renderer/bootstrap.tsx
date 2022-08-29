/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-10 15:32:56
 * @Description:
 */

import React from 'react'
import { BrowserRouter, HashRouter } from "react-router-dom"
import { createRoot } from 'react-dom/client'
import { message } from 'antd'

import "@/config/interceptor"
import { Provider, store } from '@/store'
import '@/assets/styles/globals.scss'
import App from './App'

const container = document.getElementById('App')
const root = createRoot(container)

message.config({
  duration: 2, // 持续时间
  maxCount: 1,// 最大显示数, 超过限制时，最早的消息会被自动关闭
  top: 70, // 到页面顶部距离
})

root.render(
  <Provider store={store}>
    { process.env.IS_WEB && <BrowserRouter><App /></BrowserRouter> }
    {/* 如果是桌面端，使用HashRouter，不然打包后页面404 */}
    { !process.env.IS_WEB && <HashRouter><App /></HashRouter> }
  </Provider>
)

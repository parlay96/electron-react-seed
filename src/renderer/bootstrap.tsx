/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-22 17:31:54
 * @Description:
 */

import React from 'react'
import { BrowserRouter } from "react-router-dom"
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
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

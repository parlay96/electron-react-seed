/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: penglei
 * @LastEditTime: 2022-05-27 12:01:57
 * @Description:
 */

import React from 'react'
import Home from '@/pages/home'
import '@/assets/styles/globals.scss'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('App')
const root = createRoot(container)

root.render(
  <div style={{ width: '100%', height: '100%' }}>
    <Home />
  </div>
)

/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-01 15:16:44
 * @Description:
 */

import React, { Suspense } from 'react'
import { useRoutes } from "react-router-dom"
import { routes } from '@/config'
import { AuthProvider } from './auth'

export default function App (props) {
  const element = useRoutes(routes)
  /** 不建议删除下面打印 */
  console.log(process.env.IS_WEB, '是否web端')
  console.log(process.env.NODE_ENV, '-----当前环境')
  return (
    <>
      {/* Suspense对于延迟加载组件，是必须的， 桌面端不需要 */}
      {/* <Suspense fallback="loading...">
        {element}
      </Suspense> */}
      <AuthProvider>
        {element}
      </AuthProvider>
    </>
  )
}

/*
 * @Date: 2022-06-01 19:19:53
 * @Description: 路由表
 */
import * as React from "react"
import type { RouteObject } from "react-router-dom"

import Layout from '@/layout'
import { RequireAuth } from "@/auth"
import NoMatch from '@/pages/404'

// 不要使用React.lazy异步加载组件
/** 消息 */
import Information from '@/pages/information'
/** 首页 */
import Workbench from '@/pages/workbench'
/** 通信录 */
import Contacts from '@/pages/contacts'
/** 登录 */
import Login from '@/pages/login'

/** 路由表 */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <RequireAuth><Layout /></RequireAuth>,
    children: [
      { index: true, element: <Information /> },
      { path: 'contacts',  element: <Contacts /> },
      { path: 'workbench', element: <Workbench /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  { path: "*", element: <NoMatch /> },
]

export default routes

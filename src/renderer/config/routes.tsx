/*
 * @Date: 2022-06-01 19:19:53
 * @Description: 路由表
 */
import * as React from "react"
import type { RouteObject } from "react-router-dom"

import Layout from '@/layout'
import { RequireAuth } from "@/auth"
const NoMatch = React.lazy(() => import('@/pages/404'))

/** 首页 */
import Workbench from '@/pages/workbench'
/** 通信录 */
import Contacts from '@/pages/contacts'
/** 登录 */
const Login = React.lazy(() => import('@/pages/login'))

/** 路由表 */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <RequireAuth><Layout /></RequireAuth>,
    children: [
      { index: true,  element: <Contacts /> },
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

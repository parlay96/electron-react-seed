/*
 * @Date: 2022-06-01 19:19:53
 * @Description: 路由表
 */
import * as React from "react"
import type { RouteObject } from "react-router-dom"

import Layout from '@/layout'
const NoMatch = React.lazy(() => import('@/pages/404'))
/** 首页 */
const Home = React.lazy(() => import('@/pages/home'))


/** 路由表 */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  { path: "*", element: <NoMatch /> },
]

export default routes

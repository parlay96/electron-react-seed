/*
 * @Date: 2022-05-30 11:42:08
 * @Description: 权限认证
 */
import React, { useState, memo } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import {request, TOKEN, USERINFO} from '@/utils'
import {setStore, getStore} from '@/utils'
import { actions, dispatch, getState } from "@/store"

interface IAuthProps {
  children: React.ReactNode
}

const Auth = memo((props: IAuthProps) => {
  const { pathname } = useLocation()
  const [ params ] = useSearchParams()
  // 标识
  const [ refresh, setRefresh ] = useState(false)
  // 登录状态
  const isLogin = getState().user.isLogin
  return <>{ props.children }</>
})

export default Auth

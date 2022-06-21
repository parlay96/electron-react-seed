/*
 * @Author: pl
 * @Date: 2022-05-31 17:02:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-20 10:13:13
 * @Description: 头部导航
 * @FilePath: \yp-pc\src\pages\workbench\components\head\index.tsx
 */
import React, { memo, useEffect } from 'react'
import classNames from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'
import { Icon } from "@/components"
import styles from './index.module.scss'

const Head = memo(() => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  // 点击tab
  const navClick = (url: string) => {
    navigate(url)
  }
  return (
    <div className={styles.headBox}>
       导航
    </div>
  )
})

export default Head

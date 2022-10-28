/*
 * @Date: 2022-05-30 10:55:45
 * @Description: 页面内容入口
 */
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Head, Menu, VersionUpdateDialog } from '@/components'
import styles from './index.module.scss'

// 页面内容入口
const Layout= () => {

  return (
    <div className={styles.ypContainer}>
      {/* 头部 */}
      { !process.env.IS_WEB && <Head /> }
      <div className={styles.ypMain}>
        {/* 左侧菜单 */}
        <Menu />
        {/* 页面内容部分， 是比较关注的部分 */}
        <div className={styles.pannelBox}>
          <Outlet />
        </div>
      </div>
      {/* 版本更新弹窗 */}
      <VersionUpdateDialog />
    </div>
  )
}

export default Layout

/*
 * @Date: 2022-05-30 10:55:45
 * @Description:
 */
import React from 'react'
import { Outlet } from 'react-router-dom'
import classNames from 'classnames'
import { Head, Menu, Auth } from '@/components'
import { connect } from "@/store"

import styles from './index.module.scss'
export interface ILayoutProps {
  isMaximize: boolean
}

const Layout= (props: ILayoutProps) => {
  // 因为如果内容超出窗口了，就会截取断，导致隐藏不可以显示。
  // 这时候就需要做一个无边框窗口。然后给最外层盒子设置一个间距。
  // props.isMaximize 如果是最大化，就不显示阴影部分
  const ypContainerStyle = props.isMaximize ? {} : { paddingRight: '6px',paddingBottom: '6px' }
  return (
    <div className={styles.ypContainer}
      style={ypContainerStyle}>
      {/* 头部 */}
      <Head />
      <div className={classNames(styles.ypMain, !props.isMaximize ? styles.shadowBox : '')}>
        {/* 左侧菜单 */}
        <Menu />
        {/* 页面内容部分， 是比较关注的部分 */}
        <div className={styles.pannelBox}>
          <Auth><Outlet /></Auth>
        </div>
      </div>
    </div>
  )
}

export default connect((state) => {
  return {isMaximize: state.config.isMaximize}
})(Layout)

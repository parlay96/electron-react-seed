/*
 * @Date: 2022-05-31 17:02:44
 * @Description: 左侧菜单
 */
import React, { memo, useEffect, useState } from 'react'
import classNames from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '@/components'
import { menuList } from '@/config'
import styles from './index.module.scss'

// 左侧菜单
const Menu = memo(() => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const msg = 5
  return (
    <div className={styles.menuBox}>
      {menuList?.map((item, index) =>
        <div key={`menu-item-${index}`} className={classNames(styles.mitem, pathname == item.url ? styles.active : '', 'unselectable' )}>
          <p className={styles.micon}><Icon type={item.icon} size={24}/></p>
          <p className={styles.text}>{item.name}</p>
          { item.type == 'msg' && msg && <span className={styles.msgBox}>{msg}</span> }
        </div>
      )}
    </div>
  )
})

export default Menu

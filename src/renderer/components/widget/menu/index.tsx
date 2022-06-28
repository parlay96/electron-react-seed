/*
 * @Date: 2022-05-31 17:02:44
 * @Description: 左侧菜单
 */
import React, { memo } from 'react'
import classNames from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'
import { Image } from '@/components'
import { menuList } from '@/config'
import config from '@config/index'
import styles from './index.module.scss'

const msg = 5

// 左侧菜单
const Menu = memo(() => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  // 菜单栏宽度
  const menuWidth = config.menuWidth
  // 选择项宽度
  const menuItemStyle = {
    width: '60px',
    height: '60px'
  }
  // 点击menu菜单项
  const menuClick = (url: string) => {
    if (url) navigate(url)
  }
  return (
    <div className={styles.menuBox} style={{width: menuWidth + 'px'}}>
      {menuList?.map((item, index) =>
        <div key={`menu-item-${index}`} style={menuItemStyle}
          onClick={() => menuClick(item.url)}
          className={classNames(styles.mitem, pathname == item.url ? styles.active : '', 'unselectable' )}>
          <Image
            src={require(`../../../assets/imgs/${item.icon}`)}
            width={20}
            height={20}
            className={styles.micon}/>
          <p className={styles.text}>{item.name}</p>
          { item.type == 'msg' && msg && <span className={styles.msgBox}>{msg}</span> }
        </div>
      )}
    </div>
  )
})

export default Menu

/*
 * @Date: 2022-05-31 17:02:44
 * @Description: 左侧菜单
 */
import React, { memo, useEffect, useState } from 'react'
import classNames from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'
import { ImUtils } from '@/im'
import { publicSubscribe, publicPublish } from '@/dep'
import { Image } from '@/components'
import { menuList } from '@/config'
import config from '@config/index'
import styles from './index.module.scss'

// 左侧菜单
const Menu = memo(() => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [msgCount, setCount] = useState<string | number>('')
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

  useEffect(() => {
    // 监听更新消息数量
    publicSubscribe.listen({
      publisher: publicPublish,
      message: "update-msg-num",
      handler: async () => {
        const num = await ImUtils.getUnreadMessageCount()
        setCount(num > 99 ? '99+' : num)
      }
    })
    /** 卸載訂閲器 */
    return () => {
      publicPublish.removeListener(publicSubscribe, 'update-msg-num')
    }
  }, [])

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
          { item.type == 'msg' && msgCount !== 0 && <span className={styles.msgBox}>{ msgCount }</span> }
        </div>
      )}
    </div>
  )
})

export default Menu

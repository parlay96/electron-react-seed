/*
 * @Date: 2022-05-31 17:02:44
 * @Description: 头部导航
 */
import React, { memo, useEffect, useState } from 'react'
import classNames from 'classnames'
import { getStore, USERINFO, $ipc } from '@/utils'
import { Icon, Image, DragBox, PersonalCenter } from '@/components'
import styles from './index.module.scss'

// 头部导航
const Mac = memo(() => {
  const [user, setUser] = useState<any>({})
  const [showPersonalCenter, setShowPersonalCenter] = useState<boolean>(false)
  // 点击头像时
  const onPortraitClick = (event) => {
    event.stopPropagation()//阻止冒泡
    setShowPersonalCenter(!showPersonalCenter)
    getInfo()
  }
  // 获取用户头像
  const getInfo = () => {
    const userInfo = getStore(USERINFO)
    const info = userInfo?.user
    const nameText = info?.name?.length > 2 ? info?.name?.substring(info?.name?.length - 2) : info?.name
    info.portraitName = nameText
    if (info) {
      setUser(info)
    }
  }

  useEffect(() => {
    // 点击隐藏，弹窗
    document.addEventListener('click',function (){
      setShowPersonalCenter(false)
    })
    // 监听webview点击时
    $ipc.on('on-webview-click', () => {
      setShowPersonalCenter(false)
    })
    getInfo()
  }, [])

  return (
    <>
      <PersonalCenter visible={showPersonalCenter} change={(v) => setShowPersonalCenter(v)} />
      <DragBox>
        {/* 头部  */}
        <div className={classNames(styles.portrait, 'no-drag')} onClick={onPortraitClick}>
          {
            user?.avatar && <Image src={user?.avatar} width={32} height={32}/>
          }
          {
            !user?.avatar && <span>{user?.portraitName}</span>
          }
        </div>
        {/* 搜索区 */}
        <div className={styles.searchBar}>
          <div className={classNames(styles.sbIcon, 'no-drag')}>
            <Icon type="yp-lishijilu" size={20}/>
          </div>
          <div className={classNames(styles.searchBox, 'no-drag')}>
            <Icon type="yp-search" size={16} className={styles.searchIcon}/>
            <span>搜索(Ctrl+K)</span>
          </div>
          <div className={classNames(styles.sbIcon, 'no-drag')}>
            <Icon type="yp-plus" size={20}/>
          </div>
        </div>
        {/* 功能区 */}
        <div className={styles.navOther}>
          <div className={classNames(styles.otherItem, 'no-drag')}>
            <Icon type="yp-kefu1" size={20}/>
            <span className={styles.text}>客服</span>
          </div>
        </div>
      </DragBox>
    </>
  )
})

export default Mac

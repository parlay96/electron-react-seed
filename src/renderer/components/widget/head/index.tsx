/*
 * @Date: 2022-05-31 17:02:44
 * @Description: 头部导航
 */
import React, { memo } from 'react'
import classNames from 'classnames'
import { Icon, Image, DragBox } from '@/components'
import juese from '@/assets/imgs/juese.png'
import styles from './index.module.scss'

// 头部导航
const Head = memo(() => {
  // 点击头像时
  const onPortraitClick = () => {
    console.log(123)
  }

  return (
    <DragBox>
      {/* 头部  */}
      <div className={classNames(styles.portrait, 'no-drag')} onClick={onPortraitClick}>
        <Image src={juese} className={styles.aitImg}/>
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
  )
})

export default Head

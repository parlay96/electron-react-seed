/*
 * @Date: 2022-08-16 14:23:22
 * @Description: 个人设置悬浮框
 */
import React, { useState } from 'react'
import classNames from 'classnames'
import { renderToBody } from '@/utils'
import { Icon } from '@/components'
import Account from './components/account'
import Currency from './components/currency'
import styles from './index.module.scss'

let unmount = null // 卸载

const settingData = [
  { name: '通用', icon: 'yp-site', key: '1' },
  // { name: '隐私', icon: 'yp-yinsibaohu', key: '2' },
  { name: '账户管理', icon: 'yp-wode', key: '3' }
]

const PersonalSettings = (props: {keys: string}) => {
  const [activeKey, setActiveKey] = useState<string>(props.keys || '1')
  return(
    <div className={styles.personalSettingBox}>
      <div className={styles.title}>
        <span>设置</span>
        <p className={styles.close} onClick={() => {
          unmount?.()
          unmount = null
        }}><Icon type="yp-close" size={20}/></p>
      </div>
      <div className={styles.listBox}>
        <div className={styles.sideBox}>
          { settingData?.map(item =>
            <div
              className={classNames(
                styles.itemMenu,
                activeKey == item.key ? styles.active : '',
                'unselectable')}
              onClick={() => setActiveKey(item.key)}
              key={item.key}>
              <Icon type={item.icon} size={ 17 } />
              <span className={styles.name}>{item.name}</span>
            </div>
          )}
        </div>
        <div className={styles.layoutBox}>
          {activeKey == '1' && <Currency />}
          {activeKey == '3' && <Account />}
        </div>
      </div>
    </div>
  )
}

const createPersonalSettings = (key: string | boolean) => {
  // 代表关闭弹窗，如果key是一个布尔值false
  if (!key) {
    if (unmount) {
      setTimeout(() => {
        unmount?.()
        unmount = null
      }, 200)
    }
    return
  }
  if (unmount) {
    unmount?.()
  }
  unmount = renderToBody(<PersonalSettings keys={key as string} />)
}

export default createPersonalSettings

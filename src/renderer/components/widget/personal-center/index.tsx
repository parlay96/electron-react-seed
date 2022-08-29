/*
 * @Date: 2022-08-05 16:17:01
 * @Description: 个人中心悬浮框
 */
import React, {useState, useEffect, memo} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getStore, USERINFO } from '@/utils'
import { Image, personalSettingsDialog } from '@/components'
import { $ipc, logOut } from '@/utils'
import styles from './index.module.scss'
import classNames from 'classnames'

const PersonalCenter = memo((props: {visible: boolean, change: (v:boolean)=> void}) => {
  const {visible, change: _change} = props
  const userInfo = getStore(USERINFO)
  const navigate = useNavigate()
  const location = useLocation()
  const [show, setShow] = useState<boolean>(true)
  const [user, setUser] = useState<any>({})
  // 路由变化直接隐藏设置弹窗
  useEffect(() => {
    personalSettingsDialog(false)
  }, [location])

  useEffect(() => {
    if (!visible) return
    const info = userInfo?.user
    const nameText = info?.name?.length > 2 ? info?.name?.substring(info?.name?.length - 2) : info?.name
    info.portraitName = nameText
    if (info) {
      setUser(info)
    }
  }, [visible])

  useEffect(() => {
    setShow(visible)
  }, [visible])

  // 主进程通信
  const ipcBrowserChange = async (event: string) => {
    await $ipc.invoke(event)
  }

  return(
    show && <div className={classNames(styles.personalCenterBox,
      process.platform === 'darwin' ? styles.personalMac : styles.personalWindow)}
    onClick={(event) => event.stopPropagation()}>
      <div className={styles.headBox}>
        <div className={styles.headImg}>
          {
            user?.avatar && <Image src={user?.avatar} width={48} height={48}/>
          }
          {
            !user?.avatar && <span>{user?.portraitName}</span>
          }
        </div>
        <div className={styles.info}>
          <p className={styles.name}>{user.name}</p>
          <p className={styles.phone}>{user.mobile}</p>
        </div>
      </div>
      <div className={classNames(styles.featureMenu, styles.afterLine)}>
        <div className={styles.featureItem} onClick={() => {
          personalSettingsDialog('1')
          _change(false)
        }}>
           设置
        </div>
      </div>
      <div className={styles.featureMenu}>
        <div className={styles.featureItem} onClick={() => {
          personalSettingsDialog('3')
          _change(false)
        }}>
           账户管理
        </div>
        <div className={styles.featureItem} onClick={() => {
          personalSettingsDialog(false)
          logOut()
        }}>
           切换账号
        </div>
        <div className={styles.featureItem} onClick={()=> ipcBrowserChange('quit-app')}>
           退出工程云
        </div>
      </div>
    </div>
  )
})

export default PersonalCenter

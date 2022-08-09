/*
 * @Date: 2022-08-05 16:17:01
 * @Description: 个人中心悬浮框
 */
import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getStore, USERINFO } from '@/utils'
import {Image} from '@/components'
import { $ipc, logOut } from '@/utils'
import styles from './index.module.scss'

const PersonalCenter = () => {
  const userInfo = getStore(USERINFO)
  const navigate = useNavigate()
  const [user, setUser] = useState<any>({})
  useEffect(() => {
    const info = userInfo?.user
    const nameText = info?.name?.length > 2 ? info?.name?.substring(info?.name?.length - 2) : info?.name
    info.portraitName = nameText
    if (info) {
      setUser(info)
    }
  }, [])
  // 主进程通信
  const ipcBrowserChange = async (event: string) => {
    await $ipc.invoke(event)
  }
  return(
    <div className={styles.personalCenterBox} onClick={(event) => event.stopPropagation()}>
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
      <div className={styles.featureMenu}>
        <div className={styles.featureItem} onClick={() => {
          logOut()
          navigate('/login')
        }}>
           切换账号
        </div>
        <div className={styles.featureItem} onClick={()=> ipcBrowserChange('quit-app')}>
           退出工程云
        </div>
      </div>
    </div>
  )
}

export default PersonalCenter

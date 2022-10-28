/*
 * @Author: penglei
 * @Date: 2022-08-17 16:43:25
 * @LastEditors: penglei
 * @LastEditTime: 2022-08-20 14:42:15
 * @Description:
 */
import React, { useState, useEffect } from 'react'
import { Upload, message } from 'antd'
import { getStore, USERINFO, TOKEN, request, setStore } from '@/utils'
import { REQUESTURL } from '@/config'
import { Icon, Image } from '@/components'
import styles from './index.module.scss'

// 账户管理
const Account = () => {
  const userInfo = getStore(USERINFO)
  const token = getStore(TOKEN)
  const [user, setUser] = useState<any>({})
  const [valueName, setValueName] = useState<string>('')
  const [isInput, setShowInput] = useState<boolean>(false)

  useEffect(() => {
    const info = userInfo?.user
    if (info) {
      setUser(info)
      setValueName(info.name)
    }
  }, [])

  // 上传回调
  const uploadChange = async ({ file }) => {
    if (file.status == 'done' && file.response) {
      const { data } = file.response
      if (data) {
        const order = await request['POST/account/update-name']({ avatar: data.file_url_path })
        if (order.code == 0) {
          const info = { ...userInfo, user: { ...user,avatar: data.file_url_path } }
          setUser({ ...user, avatar: data.file_url_path })
          setStore(USERINFO, info)
          order.msg && message.success(order.msg)
        }
      }
    }
  }

  // 点击修改用户名
  const editClick = async () => {
    const v = valueName.replace(/\s*/g, "")
    const order = await request['POST/account/update-name']({ name: v })
    if (order.code == 0) {
      const info = { ...userInfo, user: {...user, name: v} }
      setUser({ ...user, name: v })
      setShowInput(false)
      setStore(USERINFO, info)
      order.msg && message.success(order.msg)
    }
  }

  return (
    <div className={styles.accountBox}>
      <div className={styles.title}>账号管理</div>
      <div className={styles.info}>
        <Upload
          action={REQUESTURL + '/upload/uploadImage'}
          headers={{
            Authorization: token
          }}
          accept="image/png, image/jpeg"
          onChange={uploadChange}
        >
          {!user?.avatar &&
          <div className={styles.headBox}>
            <div className={styles.noImg}>
              <p><Icon type='yp-wode' color='#fff' size={24}/></p>
            </div>
            <div className={styles.noText}>
            上传图片
            </div>
          </div>
          }
          {
            user?.avatar &&
          <div className={styles.headImgBox}>
            <Image src={user?.avatar} width={60} height={60} />
          </div>
          }
        </Upload>
        <div className={styles.userInfo}>
          <p className={styles.tie}>账号名称</p>
          { !isInput &&
            <div className={styles.edit}>
              <p>{user?.name}</p>
              <p className={styles.btns} onClick={() => setShowInput(!isInput)}>
                <Icon type='yp-edit' size={18} color="#606066" />
              </p>
            </div>
          }
          { isInput &&
            <div className={styles.editBox}>
              <div className={styles.inputBox}>
                <input maxLength={10} value={valueName} onChange={(e) => {
                  setValueName(e.target.value)
                }} />
              </div>
              <div className={styles.btns}>
                <p><Icon type='yp-duigou' size={20} onClick={editClick} /></p>
                <p><Icon type='yp-close'size={20} onClick={() => setShowInput(false)} /></p>
              </div>
            </div>
          }
        </div>
      </div>
      {/* <div className={styles.infoItem}>
        <div className={styles.titleCli}>手机号</div>
        <div className={styles.infoas}>
          <span className={styles.titleCli}>{user?.mobile}</span>
          <span className={styles.btnText}>更换</span>
        </div>
      </div> */}
      {/* <div className={styles.infoItem}>
        <div className={styles.titleCli}>密码</div>
        <div className={styles.infoas}>
          <span className={styles.titleCli}>忘记时可重新设置</span>
          <span className={styles.btnText}>重置</span>
        </div>
      </div> */}
      {/* <div className={styles.infoItem}>
        <div className={styles.titleCli}>登录设备</div>
        <div className={styles.deviceList}>
          <div className={styles.deviceItem}>
            <div className={styles.tiles}>
              <Icon type='yp-diannao' size={16} color="#8A8A99" />
              <span className={styles.name}>kjhckjhcdkhahc</span>
            </div>
            <p>型号：window 10</p>
            <p>登录时间：20221234 02:08</p>
          </div>
          <div className={styles.deviceItem}>
            <div className={styles.tiles}>
              <Icon type='yp-diannao' size={16} color="#8A8A99" />
              <span className={styles.name}>kjhckjhcdkhahc</span>
            </div>
            <p>型号：window 10</p>
            <p>登录时间：20221234 02:08</p>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Account

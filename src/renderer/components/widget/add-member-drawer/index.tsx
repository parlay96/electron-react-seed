/*
 * @Author: penglei
 * @Date: 2022-09-02 09:52:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-17 17:36:34
 * @Description: 添加成员弹窗
 */
import React, { useState, useEffect } from 'react'
import { Drawer } from 'antd'
import classNames from 'classnames'
import { Icon, Image } from '@/components'
import { request, getStore, USERINFO } from '@/utils'
import styles from './index.module.scss'

interface IAddMember {
  visible: boolean,
  close: (e: any) => void
}

const AddMemberDrawer = (props: IAddMember) => {
  const userInfo = getStore(USERINFO)
  // 控制弹窗
  const [visibleDrawer, setVisible] = useState<boolean>(false)
  // 邀请二维码信息
  const [codeInfo, setCodeInfo] = useState<{corp_name?: string, qrcode_img?: string}>({})
  // 添加人员的类型 0是二维码 1是手机号
  const [type, setType] = useState<0 | 1>(0)
  // 成员数组
  const [memberData, setMemberData] = useState<{name: string, phone: string}[]>([])
  // 显示提示
  const [showTip, setTip] = useState<boolean>(false)
  // 邀请结果
  const [orderObj, setOrder] = useState<any>({})
  // 监听变化
  useEffect(() => {
    setVisible(props?.visible)
    props?.visible && setType(0)
    props?.visible && setMemberData([{
      name: '',
      phone: ''
    }])
  }, [props?.visible])

  // 获取二维码信息
  useEffect(() => {
    const account_id = userInfo?.user?.account_id
    const cId = userInfo?.user?.cid
    const contacts_id = userInfo?.user?.contacts_id
    request['GET/corp/invite-qr-code']({ corp_id: cId, contacts_id, refid: account_id }).then(data => {
      if (data?.code == 0) {
        setCodeInfo(data?.data)
      }
    })
  }, [])

  // 输入框变化
  const onInfoChange = (key, value, index) => {
    const data = JSON.parse(JSON.stringify(memberData))
    const nv = value.replace(/[^\d]/g, '')
    if (key == 'phone') {
      data[index][key] = nv
    } else {
      data[index][key] = value
    }
    setMemberData(data)
  }
  // 提交
  const onSubmit = async () => {
    const cId = userInfo?.user?.cid
    const contacts_id = userInfo?.user?.contacts_id
    const refid = userInfo?.user?.account_id
    const invite_user = memberData?.map(item => {
      return {
        tel: item.phone,
        user_name: item.name
      }
    })
    const data = await request['POST/corp/invite-user']({ corp_id: cId, contacts_id, refid, invite_user })
    if (data.code == 0) {
      const {can_invite, joined, mobile_wrong} = data.data
      setOrder({
        attemptNum: memberData.length, // 尝试添加人员数量
        successNum: can_invite.length, // 成功人员数量
        can_invite: can_invite?.length > 0 ? can_invite?.map(item => item.user_name) : null,
        joined: joined?.length > 0 ? joined?.map(item => item.user_name) : null,
        mobile_wrong: mobile_wrong?.length > 0 ? mobile_wrong?.map(item => item.user_name) : null
      })
      setTip(true)
    }
  }

  return (
    <Drawer
      placement="right"
      width={375}
      closable={false}
      style={{ top: '50px' }}
      bodyStyle={{padding: 0}}
      onClose={(e) => props?.close(e)}
      visible={visibleDrawer}>
      <div className={styles.addMember}>
        <div className={styles.head}>
          <span>{type == 0 ? '邀请成员' : '手机号添加'}</span>
          <p className={styles.back} onClick={(e) => {
            if (type == 1) {
              setType(0)
            } else {
              props?.close(e)
            }
          }}>
            <Icon type='yp-zuojiantou' size={20} />
          </p>
        </div>
        <div className={styles.QRContent} style={{display: type == 0 ? 'block' : 'none'}}>
          <div className={styles.QRCode}>
            <p className={styles.title}>{codeInfo.corp_name}</p>
            <p className={styles.cont}>新员工使用鱼泡云扫码加入企业</p>
            <div className={styles.imgqr}>
              <Image width={196} height={196} src={codeInfo.qrcode_img} />
            </div>
          </div>
          <div className={styles.btns}>
            <div className={styles.phoneBtn} onClick={() => setType(1)}>
              <div className={styles.iconc}>
                <Icon type='yp-iPhone' size={26} color="#5290fd" />
              </div>
              <p>手机号添加</p>
            </div>
          </div>
        </div>
        <div className={styles.phoneAdd} style={{ display: type == 1 ? 'block' : 'none' }}>
          { memberData?.map((item, index) =>
            <div className={styles.itemBox} key={`member-${index}`}>
              <div className={styles.title}>
                <span>成员{index + 1}</span>
                <span className={styles.del} onClick={() => {
                  memberData?.splice(index, 1)
                  setMemberData(JSON.parse(JSON.stringify(memberData)))
                }}>删除</span>
              </div>
              <div className={styles.info}>
                <div className={classNames(styles.inputBox, styles.border)}>
                  <p className={styles.name}>姓名</p>
                  <input
                    value={item?.name}
                    maxLength={5}
                    onChange={(e) => onInfoChange('name', e.target.value, index)} />
                </div>
                <div className={classNames(styles.inputBox)}>
                  <p className={styles.name}>手机号</p>
                  <input
                    value={item.phone}
                    maxLength={11}
                    onChange={(e) => onInfoChange('phone', e.target.value, index)} />
                </div>
              </div>
            </div>
          )}
          <div className={classNames(styles.addBtn, 'unselectable')} onClick={() => {
            setMemberData([
              ...memberData,
              {name: '', phone: ''}
            ])
          }}>
            <Icon type='yp-plus' size={18} />
            <span style={{marginLeft: '5px'}}>添加成员</span>
          </div>
        </div>
        <div className={styles.conserve} style={{ display: type == 1 ? 'block' : 'none' }}>
          <div className={styles.btn} onClick={onSubmit}>确定添加({memberData.length})</div>
        </div>
        <div className={styles.tipBox} style={{ display: showTip ? 'block' : 'none' }}>
          <div className={styles.conBox}>
            <p className={styles.title}>成员添加完成</p>
            <p style={{marginTop: '8px'}}>尝试添加{orderObj?.attemptNum}名成员，成功添加<span>{orderObj?.successNum}</span>名：</p>
            {orderObj?.can_invite &&
              <div>
                <p className={styles.text}>
                  { orderObj?.can_invite?.join('、')}
                </p>
                <p>对方同意后即可加入组织</p>
              </div>
            }
            {orderObj?.joined &&
              <div>
                <p className={styles.text}>
                  { orderObj?.joined?.join('、')}
                </p>
                <p>已存在于通讯录内，自动跳过</p>
              </div>
            }
            {orderObj?.mobile_wrong &&
              <div>
                <p className={styles.text}>
                  { orderObj?.mobile_wrong?.join('、')}
                </p>
                <p>不是手机号，不可加入团队</p>
              </div>
            }
            <div className={styles.btn} onClick={(e) => {
              setTip(false)
              props?.close(e)
            }}>确认</div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default AddMemberDrawer

/*
 * @Author: penglei
 * @Date: 2022-09-02 09:52:44
 * @LastEditors: penglei
 * @LastEditTime: 2022-09-03 16:06:19
 * @Description: 成员申请弹窗
 */
import React, { useState, useEffect } from 'react'
import { Drawer, message } from 'antd'
import classNames from 'classnames'
import { Icon, Image } from '@/components'
import { request, getStore, USERINFO } from '@/utils'
import styles from './index.module.scss'

interface IMembershipDrawer {
  visible: boolean,
  close: (e?: any) => void
}

const MembershipDrawer = (props: IMembershipDrawer) => {
  const userInfo = getStore(USERINFO)
  // 控制弹窗
  const [visibleDrawer, setVisible] = useState<boolean>(false)
  // 全选开关
  const [checkAall, setAll] = useState<boolean>(false)
  // 成员列表
  const [data, setData] = useState<any>([])
  // 已选择
  const [checkData, setCheckData] = useState<any>([])
  // 监听变化
  useEffect(() => {
    setVisible(props?.visible)
    if (props?.visible) {
      getData()
    }
  }, [props?.visible])

  const getData = () => {
    const cId = userInfo?.user?.cid
    request['GET/corp/invite-list']({corp_id: cId, page_size: 999}).then(data => {
      if (data?.code == 0) {
        data?.data?.list?.forEach(item => {
          const nameText = item?.apply_name?.length > 2 ? item?.apply_name?.substring(item?.apply_name?.length - 2) : item.apply_name
          item.portraitName = nameText
        })
        // 找出未处理的数据
        const newData = data?.data?.list?.filter(item => item.invite_status == 1)
        setData(newData)
      }
    })
  }

  // 提交
  const onSubmit = async (type) => {
    if (checkData?.length == 0) {
      message.info('请选择人员')
      return
    }
    const data = await request['POST/account/check-apply']({
      corp_apply_join_id: checkData,
      invite_status: type
    })
    if (data.code == 0) {
      message.success('操作成功！')
      props?.close()
    }
  }

  // 点击全选
  const onCheckAll = async () => {
    // 取消全选
    if (checkAall) {
      setCheckData([])
    } else {
      // 全选
      setCheckData(data.map(item => item.corp_apply_join_id))
    }
    setAll(!checkAall)
  }
  // 点击单选
  const onCheck = async (id) => {
    if (checkData.indexOf(id) !== -1) {
      const data = checkData.filter(item => item !== id)
      setCheckData(data)
    } else {
      const data = JSON.parse(JSON.stringify(checkData))
      data.push(id)
      setCheckData(data)
    }
  }

  const IconDom = (id) => {
    if (checkData.indexOf(id) !== -1) {
      return <Icon type='yp-yuanxingxuanzhong-fill' size={20} color='#5290fd'/>
    }
    return <Icon type='yp-danxuan' size={20} />
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
      <div className={styles.membershipDrawer}>
        <div className={styles.headBox}>
          <span>成员申请</span>
          <p className={styles.back} onClick={(e) => props?.close(e)}>
            <Icon type='yp-zuojiantou' size={20} />
          </p>
        </div>
        <div className={styles.conBox}>
          {data?.map((item, index) =>
            <div className={styles.memberItem} key={'memberItem' + index}>
              <div className={styles.boxc}>
                <div className={styles.check} onClick={()=> onCheck(item.corp_apply_join_id)}>
                  {IconDom(item.corp_apply_join_id)}
                </div>
                <div className={styles.head}>
                  {item.avatar && <Image src={item.avatar} width={ 44 } height={44} />}
                  {!item.avatar && <span>{item.portraitName}</span>}
                </div>
              </div>
              <div className={styles.info}>
                <p className={styles.name}>{item.apply_name}</p>
                {item.refid_name &&
                  <p className={styles.text}>由<span style={{ color: '#5290FD' }}>{item.refid_name}</span>邀请加入</p>
                }
                <p className={styles.title}>申请加入</p>
                <p>{item.corp_name}</p>
                <p className={styles.title}>加入部门</p>
                <p>{item.contacts_name}</p>
              </div>
            </div>
          )}
          {data?.length == 0 && <div className={styles.noData}>暂无数据</div>}
        </div>
        <div className={classNames(styles.btnBox, 'unselectable')}>
          <div className={styles.checkAll} onClick={onCheckAll}>
            { checkAall && <Icon type='yp-yuanxingxuanzhong-fill' size={24} color='#5290fd'/>}
            { !checkAall && <Icon type='yp-danxuan' size={24} /> }
            <span className={styles.allText}>全选</span>
          </div>
          <div className={styles.btns}>
            <div className={classNames(styles.itemBtn)} onClick={() => onSubmit(3)}>拒绝</div>
            <div className={classNames(styles.itemBtn, styles.agree)} onClick={() => onSubmit(2)}>同意</div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default MembershipDrawer

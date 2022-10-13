/*
 * @Date: 2022-06-29 10:49:43
 * @Description: 通信录人员列表
 */
import React, {useState} from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Image, Icon, Treenode, ITreenode, YpBreadcrumb, AddMemberDrawer, MembershipDrawer } from '@/components'
import { switchEnterprise } from '@/utils'
import { WORKBENCH } from '@/config'
import styles from './index.module.scss'

interface IPersonnel {
  contactsInfo: {[key: string]: any}
  crumbClick: (v: any) => void
  dataSource: {
    navigations?: {contacts_id: string, title: string}[]
    data?: ITreenode[]
  }
}

const Personnel = (props: IPersonnel) => {
  const navigate = useNavigate()
  const { contactsInfo, dataSource, crumbClick } = props
  const { navigations, data: _data } = dataSource
  // 控制添加成员弹窗
  const [visible, setVisible] = useState<boolean>(false)
  // 控制成员申请列表弹窗
  const [memberVisible, setMemberVisible] = useState<boolean>(false)
  // 点击面包屑
  const onCrumbClick = (e, index) => {
    // 不可以点击最后一个
    if (index !== navigations.length - 1) {
      crumbClick(e)
    }
  }

  const customTitleRender = (item) => {
    return (
      <>
        {
          item?.type != 'user' &&
         <div className={styles.depaImgBox}>
           <Image src={require(`@/assets/imgs/org-icon.png`)} width={24} height={24}/>
         </div>
        }
        {
          item?.type == 'user' &&
          <div className={styles.userImgBox}>
            {/* 没有头像 */}
            {!item?.avatar && <span>{item?.portraitName}</span>}
            {item?.avatar && <Image src={item?.avatar} width={36} height={36}/>}
          </div>
        }
        <p className={styles.nodeTitle}>
          {item.name}
          {item.people_number && <span>({item.people_number})</span>}
        </p>
        {item.type != 'user' && <div className={styles.btnNode}>下级</div>}
      </>
    )
  }

  return (
    <div className={styles.personnelView}>
      <div className={styles.header}>
        <div className={styles.orgNameBox}>
          <div className={styles.portraitBox}>
            { contactsInfo?.avatar && <Image width={40} height={40} src={contactsInfo?.avatar}/> }
            { !contactsInfo?.avatar && <span>{contactsInfo?.portraitName}</span> }
          </div>
          <p className={styles.textName}>{contactsInfo?.name}</p>
        </div>
        <div className={styles.btnGroup}>
          <Button icon={<Icon type="yp-cailiaokucun"/>} onClick={() => setVisible(true)}>添加成员</Button>
          <Button icon={<Icon type="yp-cailiaokucun"/>} onClick={() => setMemberVisible(true)}>成员申请</Button>
          <Button onClick={() => {
            switchEnterprise(contactsInfo.cid).then(data => {
              navigate(WORKBENCH, {state:{ url:'/enterprise/member'}})
            })
          }} icon={<Icon type="yp-multiple-people"/>}>成员管理</Button>
        </div>
      </div>
      <YpBreadcrumb data={navigations} crumbClick={onCrumbClick}/>
      <div className={styles.userListBox}>
        <Treenode
          data={_data}
          Key="key"
          onSelect={(node) => {
            // 不可以点击用户
            if (node.type == 'user') return
            crumbClick(node)
          }}
          titleRender={(node) => customTitleRender(node)}
          style={{height: '52px'}}/>
      </div>
      {/* 添加成员弹窗 */}
      <AddMemberDrawer visible={visible} close={() => setVisible(false)} />
      {/* 成员申请 */}
      <MembershipDrawer visible={memberVisible} close={() => setMemberVisible(false)}/>
    </div>
  )
}

export default Personnel

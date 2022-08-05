/*
 * @Date: 2022-06-28 11:47:52
 * @Description: 通信录
 */
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { request, getStore, USERINFO, switchEnterprise } from '@/utils'
import { Image, Treenode, ITreenode, complexPicker } from '@/components'
import { WORKBENCH } from '@/config'
import { Personnel } from './components'
import { cleanList, cleanSonList, getEnterpriseInfo } from './utils'
import styles from './index.module.scss'

interface IOrganizationProps {
  name: string
  children: ITreenode[]
  id: string
  /** 其他 */
  [key: string]: any
}

// 通信录
const Contacts = () => {
  const navigate = useNavigate()
  // 通信录列表数据
  const [contactsList, setContactsList] = useState<IOrganizationProps[]>([])
  // 当前选中的通信录，公司
  const [contactsInfo, setContactsInfo] = useState<Partial<{
    name: string,
    avatar: string,
    cid: string,
    contacts_id: string,
  }>>({})
  // 当前左侧高亮的部门ID
  const [selectedKey, setSelectedKey] = useState<string[]>([])
  // 当前子部门数据
  const [contactsSonList, setContactsSonList] = useState<{
    navigations?: {contacts_id: string, title: string}[]
    data?: ITreenode[]
  }>({})
  // 当前用户在企业下面的部门ids
  const [departmentIds, setDepartmentIds] = useState<string[]>([])

  useEffect(() => {
    // complexPicker({
    //   title: '选择部门',
    //   contacts_id: "72994430619959296",
    //   type: 'users',
    //   onConfirm: (data) => {
    //     console.log(data)
    //   }
    // })
    getContactsList()
  }, [])

  // 获取通信录列表数据
  const getContactsList = async () => {
    const { data } = await request['POST/corp/contacts/address-book']()
    const List = cleanList(data.list)
    if (List.length) {
      // 设置列表数据
      setContactsList(List)
      // 根据用户信息，找出当前选择的默认企业
      const userInfo = getStore(USERINFO)
      const cid = userInfo?.user?.cid || List[0].cid
      const {info, departmentIds, initSelectedKey} = getEnterpriseInfo(cid, List)
      // 当前用户在企业下面的部门ids
      setDepartmentIds(departmentIds)
      // 当前企业信息
      setContactsInfo(info)
      // 默认高亮我的企业下面的第一个部门
      setSelectedKey([initSelectedKey])
      // 查询子级部门
      getContactSonList(initSelectedKey)
    }
  }

  // 根据部门ID获取子级
  const getContactSonList = async (contacts_id) => {
    const { data } = await request['GET/corp/contacts/children-list']({contacts_id})
    const List = cleanSonList(data)
    setContactsSonList(List)
  }

  return (
    <div className={styles.contactsView}>
      <div className={styles.contactPersonBox}>
        <div className={styles.cpTitleBox}>
          <div className={styles.title}>
            <h2>通讯录</h2>
          </div>
        </div>
        {/* 通信录列表 */}
        <div className={styles.companyList}>
          {contactsList?.map((item, index) =>
            <div className={styles.organizationView} key={`org-${index}`}>
              <div className={styles.orgInfoBox}>
                <div className={styles.orgNameBox}>
                  <div className={styles.portraitBox}>
                    { item?.avatar && <Image width={40} height={40} src={item?.avatar}/> }
                    { !item?.avatar && <span>{item?.portraitName}</span> }
                  </div>
                  <p className={styles.textName}>{item.name}</p>
                </div>
                <div className={styles.orgBtn} onClick={() => {
                  if (item.admin_level !== 0) {
                    switchEnterprise(item.cid).then(data => {
                      navigate(WORKBENCH, {state:{ url:'/enterprise/member'}})
                    })
                  }
                }}>{item.admin_level !== 0 ? '管理' : '邀请'}</div>
              </div>
              <div className={styles['yp-tree']}>
                <div className={styles.treeList}>
                  <Treenode
                    data={item.children}
                    Key="key"
                    onSelect={(node) => {
                      // 已经选中不可以点击
                      const flag = selectedKey?.includes(node.contacts_id?.toString())
                      if (!flag && node.type !== 'user') {
                        const {info, departmentIds} = getEnterpriseInfo(node.cid, contactsList)
                        // 更新右侧数据
                        getContactSonList(node.contacts_id)
                        // 当前用户在企业下面的部门ids
                        setDepartmentIds(departmentIds)
                        // 当前企业信息
                        setContactsInfo(info)
                        // 设置当前选中项
                        setSelectedKey([node.contacts_id])
                      }
                      // 点击角色时
                      if (node.type == 'user') {
                        switchEnterprise(item.cid).then(data => {
                          navigate(WORKBENCH, {state:{ url:'/enterprise/role'}})
                        })
                      }
                    }}
                    selectedKeys={selectedKey}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 子部门列表 */}
      <div className={styles.personnelList}>
        <Personnel
          contactsInfo={contactsInfo}
          crumbClick={(node) => {
            const flag = departmentIds?.includes(node.contacts_id?.toString())
            // 获取子节点
            getContactSonList(node.contacts_id)
            // 如果当前部门是我的部门。左侧高亮我自己的部门， 否侧高亮组织架构最顶级
            setSelectedKey([flag ? node.contacts_id : contactsInfo?.contacts_id])
          }}
          dataSource={contactsSonList}/>
      </div>
    </div>
  )
}

export default Contacts

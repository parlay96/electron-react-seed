/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-28 17:12:30
 * @Description: 选择部门。或者选择人员弹窗
 */
import React, {useEffect, useState} from 'react'
import { Spin } from 'antd'
import classNames from 'classnames'
import { Search, Treenode, ITreenode, YpBreadcrumb, Image, Icon } from '@/components'
import { request } from '@/utils'
import { DialogProps } from '../../Dialog'
import withDialog, { WrapperComponentProps } from '../withDialogProps'
import FooterButton from '../../dialog/footer-button'
import { cleanSonList, handleSelect, queryChecked, ISelected } from './utils'
import styles from './index.module.scss'

export type IComplexPickerPopupProps = {
  contacts_id: string // 企业的部门ID
  type: 'users' | 'departments' // 选择人 还是 选择部门
  pickedData?: string[] // 已选择的
  multiple?: boolean // 是否多选，为单选时max不生效
  limitTips?: string // 超过限定人数返回提示
  max?: number // 最大选择数量, 如何type为users代表选择人的最大数量，departments代表选择部门的最大数量
  must?: boolean // 必须选择东西，不然提示
  onSuccess?: (v: any) => void
} & WrapperComponentProps & DialogProps

let oldContacts_id = null
/** 选择部门。或者选择人员弹窗 */
const ComplexPickerPopup = (props: IComplexPickerPopupProps) => {
  const { contacts_id, type: _type, limitTips, must: _must } = props
  // 当前子部门数据
  const [contactsSonList, setContactsSonList] = useState<{
      navigations?: {contacts_id: string, title: string}[]
      data?: ITreenode[]
    }>({})
  // 超出选择数量的状态，或者未选择的状态
  const [isTip, setTip] = useState<boolean>(false)
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false)
  // 选中项
  const [selectedData, setSelectedData]= useState<ISelected[]>([])

  // 获取部门列表
  useEffect(() => {
    getContactSonList(contacts_id)
  }, [])

  // 根据部门ID获取子级
  const getContactSonList = async (contacts_id, keywords?: string) => {
    oldContacts_id = contacts_id
    setLoading(true)
    const { data } = await request['GET/corp/contacts/children-list']({contacts_id, keywords: keywords || ''})
    const List = cleanSonList(data, _type)
    setContactsSonList(List)
    setLoading(false)
  }

  // 点击取消按钮
  const onCancel = async () => {
    try {
      props.dialogRef?.current.close()
    } catch {}
  }

  // 点击确认按钮
  const onConfirm = async () => {
    try {
      // 未选择数据
      if (_must && selectedData.length == 0) {
        setTip(true)
        setTimeout(() => {
          setTip(false)
        }, 2000)
        return
      }
      await props?.onSuccess(selectedData)
      props.dialogRef?.current.close()
    } catch {}
  }

  // 点击面包屑
  const onCrumbClick = (item, index) => {
    // 不可以点击最后一个
    if (index !== contactsSonList?.navigations.length - 1) {
      getContactSonList(item?.contacts_id)
    }
  }

  // 自定义渲染节点
  const customTitleRender = (item) => {
    // 查询当前节点是否选择了
    const isChecked = queryChecked(item, selectedData)
    return (
      <>
        {
          // 只有当showCheckbox可以显示的时候才显示
          item.showCheckbox &&
          <label className={styles.checkbox}>
            { isChecked ? <Icon type="yp-yuanxingxuanzhong-fill" size={22} color='#5290FD'/>
              : <Icon type="yp-danxuan" size={22}/>
            }
          </label>
        }
        {/* 如果是部门 */}
        {
          item.type == 'departments' &&
           <div className={classNames(styles.depaImgBox, styles.dpimgBox)}>
             <Image src={require( `@/assets/imgs/org-icon.png`)} width={24} height={24}/>
           </div>
        }
        {/* 如果是用户 */}
        {
          item.type == 'users' && <div className={classNames(styles.userImgBox, styles.dpimgBox)}>
            {/* 没有头像 */}
            {!item?.avatar && <span>{item?.portraitName}</span>}
            {item?.avatar && <Image src={item?.avatar} width={36} height={36}/>}
          </div>
        }
        <div className={styles.nodeTitle}>
          {item.name}
          {item.people_number && <span style={{marginLeft: '5px'}}>({item.people_number})</span>}
        </div>
        {/* 如果是部门 */}
        {item.type == 'departments' &&
         <div
           className={styles.btnNode}
           onClick={(e) => {
             getContactSonList(item?.contacts_id)
             e.stopPropagation()
           }}>下级</div>
        }
      </>
    )
  }

  // 点击节点事件
  const onSelectChange = (item) => {
    // 如果部门不可以选择，且点击了部门，那么就去查询下级
    if (!item.showCheckbox && item.type == 'departments') {
      getContactSonList(item?.contacts_id)
      return
    }
    // 处理相关选择的逻辑
    handleSelect(item, selectedData, props).then(data => {
      // 添加进入选择里面去
      setSelectedData(data as any)
    }).catch(() => {
      // 提示
      setTip(true)
      setTimeout(() => {
        setTip(false)
      }, 2000)
    })
  }

  // 点击删除人员按钮
  const onClose = (item) => {
    const Key = item.type == 'users' ? 'uid' : 'contacts_id'
    setSelectedData(selectedData.filter(sitem => sitem[Key] !== item[Key]))
  }

  // 搜索框
  const onSearchChange = (e) => {
    getContactSonList(oldContacts_id, e.target.value)
  }

  return (
    <>
      <div className={styles.complexPickerPopup }>
        <div className={styles.departmentBox}>
          <div className={styles.personnelListBox}>
            <Search
              style={{width: '100%'}}
              placeholder={'搜索'}
              onChange={onSearchChange}
              className={styles.searchBox}/>
            <Spin tip="加载中" spinning={loading}>
              {/* 空数据时占位 */}
              {!contactsSonList?.navigations && <div style={{height: '100px'}}/>}
              <YpBreadcrumb
                data={contactsSonList.navigations}
                className={styles.breadcrumbBox}
                crumbClick={onCrumbClick}/>
              <div className={styles.pickerListBox}>
                {contactsSonList?.data?.length == 0 &&
                 <div className={styles.noData}>暂无{_type == 'departments' ? '部门' : '人员'}</div>}
                <Treenode
                  data={contactsSonList.data}
                  treenodeClass={styles.dpTreenode}
                  Key="key"
                  onSelect={onSelectChange}
                  titleRender={(node) => customTitleRender(node)}/>
              </div>
            </Spin>
          </div>
          <div className={styles.selectedBox}>
            <div className={styles.kcqm}>已选：{selectedData?.length}{_type == 'departments' ? '个部门' : '名成员'}</div>
            <div className={styles.selectedList}>
              {selectedData?.length == 0 && <div className={styles.noSelectedData}>暂未选择</div>}
              {selectedData?.map((item, index) =>
                <div className={styles.llJcti} key={`lljcti-${index}`}>
                  {
                    item.type == 'departments' &&
                    <div className={classNames(styles.depaImgBox, styles.dpimgBox)}>
                      <Image src={require( `@/assets/imgs/org-icon.png`)} width={24} height={24}/>
                    </div>
                  }
                  {
                    item.type == 'users' &&
                    <div className={classNames(styles.userImgBox, styles.dpimgBox)}>
                      {/* 没有头像 */}
                      {!item?.avatar && <span>{item?.portraitName}</span>}
                      {item?.avatar && <Image src={item?.avatar} width={36} height={36}/>}
                    </div>
                  }
                  <div className={styles.info}>
                    <p className={styles.name}>{item?.name}</p>
                    { item.type == 'departments' && <p className={styles.depr}>{item?.departmentPaths?.join('/')}</p> }
                    { item.type == 'users' && <p className={styles.depr}>{item?.departments?.join(', ')}</p> }
                  </div>
                  <div className={styles.close} onClick={() => onClose(item)}><Icon type="yp-close" size={24}/></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isTip&&<div className={styles.limitTips}>{
        selectedData?.length == 0 ? `请选择${_type == 'departments' ? '部门' : '成员'}` :
          limitTips}</div>}
      {/* 底部 */}
      <FooterButton
        cancelButtonText={'取消'}
        confirmButtonText={'确认'}
        onCancel={onCancel}
        onConfirm={onConfirm}/>
    </>
  )
}

ComplexPickerPopup.defaultProps = {
  max: 500,
  limitTips: '已经超出了',
  multiple: true,
  must: true
}

export default withDialog(ComplexPickerPopup, {
  width: 770, visibleFooter: false,
  closeUnmount: true, showCloseIcon: false
})

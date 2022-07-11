/*
 * @Date: 2022-06-29 10:49:43
 * @Description: 通信录人员列表
 */
import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Button, Breadcrumb } from 'antd'
import { Image, Icon } from '@/components'
import juese from '@/assets/imgs/juese.png'
import styles from './index.module.scss'


interface IcontactsItem {
  name: string
  id: string | number
  type?: string
}

const contactsList: IcontactsItem[] = [
  {
    name: 'C端产品部（24）',
    id: '1',
  },
  {
    name: 'C端产品部（24）',
    id: '1',
  },
  {
    name: '王浩儿',
    type: 'user',
    id: '4',
  },
  {
    name: '王浩儿',
    type: 'user',
    id: '4',
  }
]

const Personnel = () => {

  const onCrumbClick = (e) => {
    console.log(e)
  }
  return (
    <div className={styles.personnelView}>
      <div className={styles.header}>
        <div className={styles.orgNameBox}>
          <div className={styles.portraitBox}>
            <Image width={40} height={40} src={juese}/>
          </div>
          <p className={styles.textName}>淘宝科技有限公司</p>
        </div>
        <div className={styles.btnGroup}>
          <Button icon={<Icon type="yp-cailiaokucun"/>}>二维码邀请</Button>
          <Button icon={<Icon type="yp-cailiaokucun"/>}>手机号添加</Button>
          <Button icon={<Icon type="yp-cailiaokucun"/>}>成员申请</Button>
          <Button icon={<Icon type="yp-cailiaokucun"/>}>成员管理</Button>
        </div>
      </div>
      <div className={styles.breadcrumbBox}>
        <Breadcrumb separator={<Icon type="yp-arrow"/>}>
          <Breadcrumb.Item className={styles.perLink} onClick={onCrumbClick}>淘宝科技有限公司</Breadcrumb.Item>
          <Breadcrumb.Item className={styles.perLink} onClick={onCrumbClick}>产研中心</Breadcrumb.Item>
          <Breadcrumb.Item onClick={onCrumbClick}>前端组</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className={styles.userListBox}>

      </div>
    </div>
  )
}

export default Personnel

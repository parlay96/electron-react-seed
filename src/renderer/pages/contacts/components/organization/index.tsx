/*
 * @Date: 2022-06-28 15:18:46
 * @Description: 组织结构
 */
import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Image } from '@/components'
import juese from '@/assets/imgs/juese.png'
import styles from './index.module.scss'

interface IcontactsItem {
  name: string
  icon: string
  layer: number
  children?: IcontactsItem[]
}

const contactsList: IcontactsItem[] = [
  {
    name: '组织架构',
    icon: 'org-icon.png',
    layer: 1,
    children: [
      {
        name: '风控组（20人）',
        icon: 'org-line.png',
        layer: 2,
      },
      {
        name: '风控组（20人）',
        icon: 'org-line.png',
        layer: 2,
      }
    ]
  },
  {
    name: '角色',
    icon: 'org-user.png',
    layer: 1
  }
]

const Organization = () => {
  // 树的子节点
  const Treenode = (data: IcontactsItem[]) => {
    return data?.map(item =>
      <React.Fragment key={`tree-treenode-${item.layer}`}>
        <div className={classNames(styles.treeTreenode, 'cursorp')}>
          <div style={{paddingLeft: `${12 * (item.layer - 1)}px`}} className={styles.nodeItem}>
            <Image
              src={require(`@/assets/imgs/${item.icon}`)}
              className={classNames(item.layer == 2 ? styles.orgLine : '')}
              width={item.layer == 1 ? 24 : 20}
              height={item.layer == 1 ? 24 : 20} />
            <p className={styles.nodeTitle}>{item.name}</p>
          </div>
        </div>
        {
          item.children? Treenode(item.children) : null
        }
      </React.Fragment>
    )
  }

  return (
    <div className={styles.organizationView}>
      <div className={styles.orgInfoBox}>
        <div className={styles.orgNameBox}>
          <div className={styles.portraitBox}>
            <Image width={40} height={40} src={juese}/>
          </div>
          <p className={styles.textName}>淘宝科技有限公司</p>
        </div>
        <div className={styles.orgBtn}>管理</div>
      </div>
      <div className={styles['yp-tree']}>
        <div className={styles.treeList}>
          {Treenode(contactsList)}
        </div>
      </div>
    </div>
  )
}

export default Organization

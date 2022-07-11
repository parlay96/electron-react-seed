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
  id: string | number
  layer: number
  type?: string
  children?: IcontactsItem[]
}

const contactsList: IcontactsItem[] = [
  {
    name: '组织架构',
    layer: 1,
    id: '1',
    children: [
      {
        name: '风控组（20人）',
        id: '2',
        layer: 2,
      },
      {
        name: '风控组（20人）',
        layer: 2,
        id: '3',
      },
      {
        name: '风控组（20人）',
        id: '50',
        layer: 2,
      },
      {
        name: '风控组（20人）',
        layer: 2,
        id: '52',
      }
    ]
  },
  {
    name: '角色',
    type: 'user',
    id: '4',
    layer: 1
  }
]

const orgData = [
  {
    name: '淘宝科技有限公司',
    list: contactsList,
    id: '341'
  },
  {
    name: '京东科技有限公司',
    list: contactsList,
    id: '342'
  },
]

const Organization = () => {
  // 树的子节点
  const Treenode = (data: IcontactsItem[]) => {
    return data?.map(item =>
      <React.Fragment key={`tree-treenode-${item.id}`}>
        <div className={classNames(styles.treeTreenode, 'cursorp')}>
          <div style={{paddingLeft: `${12 * (item.layer - 1)}px`}} className={styles.nodeItem}>
            <Image
              src={require(
                `@/assets/imgs/${
                  item.type == 'user' ? 'org-user.png' :
                    item.layer == 1 ? 'org-icon.png' :
                      'org-line.png'
                }`)}
              className={classNames(item.layer == 2 ? styles.orgLine : '')}
              width={item.layer == 1 ? 24 : 20}
              height={item.layer == 1 ? 24 : 20} />
            <p className={styles.nodeTitle}>{item.name}</p>
          </div>
        </div>
        { item.children? Treenode(item.children) : null }
      </React.Fragment>
    )
  }

  return (
    <>
      {orgData?.map(item =>
        <div className={styles.organizationView} key={`org-${item.id}`}>
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
              {Treenode(item.list)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Organization

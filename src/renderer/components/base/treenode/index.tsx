/*
 * @Date: 2022-07-14 15:29:33
 * @Description: 树子节点组件
 */
import React from 'react'
import classNames from 'classnames'
import { Image } from '@/components'
import styles from './index.module.scss'

export interface ITreenode {
  name: string
  layer: number
  type?: string
  people_number?: string
  children?: ITreenode[]
}

interface ITreenodeProps {
  data: ITreenode[]
  // 唯一key值：默认为id
  Key?: string
  // 选中项
  selectedKeys?: string[]
  /** 节点样式 */
  style?: React.CSSProperties
  treenodeClass?: string
  // 点击时
  onSelect?: (v: any) => void
  // 自定义行
  titleRender?: (node: ITreenode) => React.ReactNode
}

// 树子节点组件
const Treenode = (props: ITreenodeProps) => {
  const {
    data, treenodeClass, style: _style,
    titleRender, onSelect, selectedKeys,
    Key
  } = props

  const ItemNode = (data: ITreenode[]) => {
    return data?.map(item =>
      <React.Fragment key={`tree-treenode-${item[Key]}`}>
        <div
          style={_style}
          className={classNames(styles.treeTreenode, 'cursorp',
            treenodeClass,
            selectedKeys?.includes(item[Key]?.toString()) ? styles.activeTreeNode : '')}
          onClick={()=> onSelect?.(item)}>
          <div style={{paddingLeft: `${12 * (item.layer - 1)}px`}} className={styles.nodeItem}>
            {titleRender && titleRender?.(item)}
            {
              !titleRender &&
               <>
                 <Image
                   src={require(
                     `@/assets/imgs/${
                       item.type == 'user' ? 'org-user.png' :
                         item.layer == 1 ? 'org-icon.png' :
                           'org-line.png'
                     }`)}
                   className={styles.treeImg}
                   width={item.layer == 1 ? 24 : 20}
                   height={item.layer == 1 ? 24 : 20} />
                 <p className={styles.nodeTitle}>
                   {item.name}
                   {item.people_number && <span>({item.people_number})</span>}
                 </p>
               </>
            }
          </div>
        </div>
        { item.children? ItemNode(item.children) : null }
      </React.Fragment>
    )
  }

  return (
    <>
      {ItemNode(data)}
    </>
  )
}

export default Treenode

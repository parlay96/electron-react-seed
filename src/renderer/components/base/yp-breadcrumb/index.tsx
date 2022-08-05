/*
 * @Date: 2022-07-26 19:14:26
 * @Description: file content
 */
import React from 'react'
import { Breadcrumb } from 'antd'
import classNames from 'classnames'
import { Icon } from '@/components'
import styles from './index.module.scss'

interface IYpBreadcrumb {
  data: any[]
  className?: string
  crumbClick?: (v: any, index: number) => void
}

const YpBreadcrumb = (props: IYpBreadcrumb) => {
  const { data, crumbClick, className } = props
  return (
    <div className={classNames(styles.breadcrumbBox, className)}>
      <Breadcrumb separator={<Icon type="yp-arrow"/>}>
        {
          data?.map((item, index) =>
            <Breadcrumb.Item
              className={classNames(data.length - 1 == index ? '' : styles.perLink)}
              key={index}
              onClick={() => crumbClick?.(item, index)}>
              {item.title}
            </Breadcrumb.Item>
          )
        }
      </Breadcrumb>
    </div>
  )
}

export default YpBreadcrumb

/*
 * @Date: 2022-06-28 10:38:49
 * @Description: 图片组件。
 */

import React from 'react'
import classNames from 'classnames'
import styles from './index.module.scss'

interface ImageProps {
  src: string,
  alt?: string,
  width?: number,
  height?: number,
  /** 类名 */
  className?: string
  /** 事件 */
  onClick?: (param?: any) => VoidFunction
}

/** 图片组件。所有使用图片的地方，都使用它 */
const Image = (props: ImageProps) => {
  /** 解构数据 */
  const {
    alt: _pAlt,
    className: _pClassName,
    onClick: _onClick,
    src: _src,
    width,
    height
  } = props

  const aliyunCdn = '' // 现在还没有后续加上
  // 如果图片地址存在cdn,那么久不拼接。否则拼接上cdn地址，这一步 我们叫做图片回源。
  // 我们在webapck打包时，没有吧图片打包成base64,直接转成了绝对路径！
  const imgSrc = _src.slice(0, 5)?.indexOf('http') !== -1 ? _src : aliyunCdn + _src
  const _style = { width: width + 'px', height: height + 'px' }
  return (
    <div className={classNames(styles.ypImage, _pClassName)} style={_style} onClick={_onClick}>
      <img className={styles.ypImageImg} alt={_pAlt} src={imgSrc} style={height ? {height: height + 'px'} : {}}/>
    </div>
  )
}

export default Image

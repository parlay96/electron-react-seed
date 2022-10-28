/*
 * @Author: penglei
 * @Date: 2022-05-26 00:09:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-28 17:11:19
 * @Description: 弹窗蒙层组件
 */

import React, { CSSProperties, FC, useEffect, useState, ReactNode } from "react"
import { createPortal } from "react-dom"
import { CSSTransition } from "react-transition-group"
import classNames from "classnames"
import { GetContainer, getEleById, isIEBrowser } from "@/utils"
import styles from "./index.module.scss"

export type IMaskProps = {
  children?: ReactNode
  /** 层级 */
  zIndex?: number
  /** 是否显示 */
  visible?: boolean
  /** 自定义内部样式 */
  style?: CSSProperties
  /** 自定义内部的class */
  className?: string
  /** 挂载容器 默认dom */
  getContainer?: GetContainer
  /** 提示持续时间，若为 0 则不会自动关闭 */
  duration?: number
  /** 是否禁用鼠标滚轮事件 */
  disableMouse?: boolean
  /** 打开弹框是否进入过渡动画 */
  appear?: boolean
  /** 关闭弹框是否进入过渡动画 */
  exit?: boolean
  /** 是否显示遮罩 */
  mask?: boolean
  /** 点击遮罩是否关闭 默认不可关闭 */
  maskClosable?: boolean
  /** 关闭完成时回调 */
  afterClose?: () => void
  /** 点击朦层回调事件 */
  maskClick?: () => void
}

let maskTimer = null
let maskTimerTwo = null

/**
 * @description 弹框遮罩
 * @param props
 * @returns
 */
const Mask: FC<IMaskProps> = props => {
  /** 显示外层 */
  const [_visible, setVisible] = useState<boolean>(false)
  /** 显示内容部分 */
  const [_containerVisible, setContainerVisible] = useState<boolean>(false)

  /** 组件销毁后的事件 */
  const onExited = () => {
    setVisible(false)
    props.afterClose?.()
  }

  /** 点击朦层回调事件 */
  const handleMaskClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (props?.mask && e.currentTarget === e.target) {
      // 点击蒙层是否关闭
      if (props?.maskClosable) {
        setContainerVisible(false)
      }
      props.maskClick?.()
      e.stopPropagation()
    }
  }

  /** 到时间后 自动关闭 */
  useEffect(() => {
    /** 时间不存在，或者没有打开弹窗，则不执行 */
    if (props.duration === 0 || !props.visible) {
      return
    }

    maskTimer = setTimeout(() => {
      setContainerVisible(false)
    }, props.duration)

    return () => {
      clearTimeout(maskTimer)
    }
  }, [])

  /** 禁用页面滚动事件 */
  useEffect(() => {
    let nextDiv: HTMLDivElement | null = null
    const bindType = isIEBrowser() ? 'mousewheel' : 'wheel'
    /** 处理鼠标滚轮滑动事件 */
    const handleMouseWheel = (event: Event) => {
      if (!props.visible) return
      event.preventDefault()
      return false
    }

    if (props.disableMouse) {
      nextDiv = getEleById('__next') as HTMLDivElement
      nextDiv?.addEventListener(bindType, handleMouseWheel)
    }

    return () => {
      nextDiv?.removeEventListener(bindType, handleMouseWheel)
    }
  }, [props.disableMouse, props.visible])

  useEffect(() => {
    clearTimeout(maskTimerTwo)
    // 开启
    if (props.visible) {
      setVisible(true)
      // 如果打开弹窗, 就先打开外层盒子，延迟打开内容部分的盒子，这样才能显示动画效果
      maskTimerTwo = setTimeout(() => {
        setContainerVisible(true)
      }, 20)
    } else {
      // 如果是关闭，就先关闭内容部分的盒子，等待动画销毁事件onExited 再去执行关闭外层盒子
      setContainerVisible(false)
    }

    return () => {
      clearTimeout(maskTimerTwo)
    }
  }, [props.visible])


  const node =
    <div className={styles['yp-dialog']}>
      {/* 蒙层部分  */}
      { props?.mask && _visible && <div className={styles['mask-box']}
        style={{ backgroundColor: `rgba(0, 0, 0, ${0.45})`, zIndex: props?.zIndex }}/> }
      {/* 内部部分   */}
      <div className={classNames(styles['dialog-wrap'], !_visible && styles.ypDialogHidden)}
        onClick={ handleMaskClick }
        style={{ zIndex: props?.zIndex }}>
        <div className={classNames(styles['yp-dialog-container'], props.className)} style={{...props.style}}>
          <CSSTransition
            in={_containerVisible}
            //nodeRef={maskRef}
            appear={props.appear}
            exit={props.exit}
            timeout={200}
            classNames={{
              enter: styles.ypDialogEnter,
              enterActive: styles.ypDialogEnterActive,
              exit: styles.ypDialogExit,
              exitActive: styles.ypDialogExitActive
            }}
            onExited={onExited}
            unmountOnExit
          >
            {props.children}
          </CSSTransition>
        </div>
      </div>
    </div>

  if (props.getContainer) {
    const container = typeof props.getContainer === "function" ? props.getContainer() : props.getContainer
    return createPortal(node, container)
  }

  return node
}

Mask.defaultProps = {
  appear: true,
  maskClosable: false,
  mask: true,
  exit: true,
  zIndex: 901,
  duration: 0
}

export default Mask

/*
 * @Date: 2022-07-05 09:25:02
 * @Description: file content
 */

import React, { CSSProperties, FC, useEffect, useState, ReactNode } from "react"
import { createPortal } from "react-dom"
import { CSSTransition } from "react-transition-group"
import classNames from "classnames"
import { GetContainer, getEleById, isIEBrowser } from "@/utils"
import styles from "./index.module.scss"

export type MaskProps = {
  children?: ReactNode
  /** 层级 */
  zIndex?: number
  /** 是否显示 */
  visible?: boolean
  /** 点击事件回调 */
  onMaskClick?: () => void
  /** 背景颜色深度 */
  opacity?: "default" | "dark" | number
  /** 自定义样式 */
  style?: CSSProperties
  /** 自定义class */
  className?: string
  /** 挂载容器 默认dom */
  getContainer?: GetContainer
  /** 提示持续时间，若为 0 则不会自动关闭 */
  duration?: number
  /** 是否禁用鼠标滚轮事件 */
  disableMouse?: boolean
  /** 关闭的时候回调 */
  afterClose?: () => void
  /** 打开弹框是否进入过渡动画 */
  appear?: boolean
  /** 关闭弹框是否进入过渡动画 */
  exit?: boolean
}

/**
 * @description 弹框遮罩
 * @param props
 * @returns
 */
const Mask: FC<MaskProps> = props => {
  let timer = 0
  /** 是否显示遮罩 */
  const [_visibleMask, setVisibleMaskState] = useState<boolean>(false)
  /** 节点 */
  //const maskRef = useRef()

  /** 组件销毁后的事件 */
  const onExited = () => {
    setVisibleMaskState(false)
  }
  /** 点击朦层回调事件 */
  function handleClick (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.currentTarget === e.target) {
      props.onMaskClick?.()
      e.stopPropagation()
    }
  }

  /** 到时间后 自动关闭 */
  useEffect(() => {
    /** 时间不存在，或者没有打开弹窗，则不执行 */
    if (props.duration === 0 || !props.visible) {
      return
    }
    timer = window.setTimeout(() => {
      setVisibleMaskState(false)
      props.afterClose?.()
    }, props.duration)
    return () => {
      window.clearTimeout(timer)
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
    if (!props.visible) return
    setVisibleMaskState(true)
  }, [props.visible])

  const cls = classNames(styles.ypDialogMask, props.className, !_visibleMask && styles.ypDialogMaskHidden)

  const opacity = props.opacity === "default" ? 0.45 : props.opacity === "dark" ? 0.55 : props.opacity

  const node =
    <div
      className={cls}
      onClick={handleClick}
      style={{
        zIndex: props?.zIndex,
        backgroundColor: `rgba(0, 0, 0, ${opacity})`,
      }}
    >
      <div className={styles.ypDialogMaskContainer} style={{...props.style}}>
        <CSSTransition
          in={props.visible}
          //nodeRef={maskRef}
          appear={props.appear}
          timeout={200}
          classNames={{
            enter: styles.ypDialogMaskEnter,
            enterActive: styles.ypDialogMaskEnterActive,
            exit: styles.ypDialogMaskExit,
            exitActive: styles.ypDialogMaskExitActive
          }}
          exit={props.exit}
          onExited={onExited}
          unmountOnExit
        >
          {props.children}
        </CSSTransition>
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
  exit: true,
  zIndex: 10005,
  duration: 0,
  opacity: "default",
}

export default Mask

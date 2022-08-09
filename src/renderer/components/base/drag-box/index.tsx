/*
 * @Date: 2022-08-02 16:36:36
 * @Description: 拖动容器
 */
import React, { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from "react"
import classNames from 'classnames'
import { Icon } from '@/components'
import { actions, dispatch } from "@/store"
import { $ipc } from '@/utils'
import config from '@config/index'
import styles from './index.module.scss'

// 关于窗口拖拽的一些临时变量
let screenX = null // 鼠标按下时的坐标
let screenY = null // 鼠标按下时的坐标
let animationId = null
interface IDragBoxProps {
  /** 隐藏窗口右上角按钮区 */
  hideControlBar?: boolean
  /** 按钮颜色 */
  btnStyle?: CSSProperties
  /** 子元素 */
  children?: ReactNode // 子元素只要包含了no-drag类名，表示当前节点不可以被拖动
  /** 自定义样式 */
  style?: CSSProperties
      /** 自定义类名 */
  className?: string,
}
// 拖动容器
const DragBox = (props: IDragBoxProps) => {
  const { children, style: _style, className:_className, hideControlBar, btnStyle } = props
  // 窗口最大化（取出配置项，作为默认值）
  const [winMax, setWinMax] = useState<boolean>(config.IsMaximize)

  // 主进程通信
  const ipcBrowserChange = async (event: string) => {
    await $ipc.invoke(event)
  }

  useEffect(() => {
    // 接受F11快捷键消息
    $ipc.on('shortcutKeyEleven', (event, args) => {
      setWinMax(args)
    })
    // 接受当窗口从最大化状态退出时触发
    $ipc.on('on-unmaximize', (event, args) => {
      setWinMax(args)
    })
    // 窗口最大化时触发
    $ipc.on('on-maximize', (event, args) => {
      setWinMax(args)
    })
  }, [])

  useEffect(() => {
    // 把当前窗口状态存起来
    dispatch(actions.configActions.setMaximize(winMax))
  }, [winMax])

  // 双击时
  const headDoubleClick = (e) => {
    // 是否span（图标）标签
    const isSpan = e?.target?.nodeName == 'SPAN'
    // 是否带有no-drag类名
    const isnoDrag = e?.target?.className?.indexOf('no-drag') !== -1
    if (isSpan || isnoDrag) {
      return
    }
    // 如果双击到了非功能的盒子，就实现窗口最大化，最小化
    ipcBrowserChange(winMax ? 'window-mix' : 'window-max')
    setWinMax(!winMax)
  }

  // 鼠标按键被按下
  const onMouseDown = async (e: any) => {
    // 不是鼠标左键直接返回
    if (e.button !== 0) return
    // 是否span（图标）标签
    const isSpan = e?.target?.nodeName == 'SPAN'
    // 是否带有no-drag类名
    const isnoDrag = e?.target?.className?.indexOf('no-drag') !== -1
    if (isSpan || isnoDrag) {
      return
    }
    // const screenXY = await $ipc.sendSync('main-window-start') as {x: number, y: number}
    // screenX = screenXY.x
    // screenY = screenXY.y
    // flag = 1 // 标识鼠标被按下
    // 如果是最大窗口，再去拖动，那么久不能拖动，直接吧取消最大化窗口
    // if (winMax) {
    //   startFalg = null
    //   flag = 1 // 标识鼠标被按下
    //   screenX = e.screenX
    //   screenY = e.screenY
    // } else {
    //   // 不是最大化时，移动窗口
    //   $ipc.send('main-window-move', {canMoving: true})
    // }

    screenX = e.clientX
    screenY = e.clientY
    document.addEventListener('mouseup', onMouseUp)
    requestAnimationFrame(moveWindow)
  }

  // 鼠标释放的时候
  const onMouseUp = (e) => {
    document.removeEventListener('mouseup', onMouseUp)
    cancelAnimationFrame(animationId)
  }

  // 拖动执行
  const moveWindow = (e) => {
    $ipc.send('main-window-moving', { screenX, screenY })
    animationId = requestAnimationFrame(moveWindow)
  }

  return (
    <div
      style={_style}
      className={classNames(styles.dragBox, _className, 'unselectable')}
      // 使用 -webkit-app-region: drag; 代替事件
      // onMouseDown={ onMouseDown }
      // onDoubleClick={headDoubleClick}
    >
      <>
        {children}
      </>
      {/* 功能区 */}
      {
        !hideControlBar &&
        <div className={styles.browserRibbon}>
          <div
            className={classNames(styles.itemBtn ,'no-drag')}
            style={btnStyle}
            onClick={() => ipcBrowserChange('windows-mini')}>
            <Icon type="yp-zuixiaohua" size={18}/>
          </div>
          <div
            className={classNames(styles.itemBtn ,'no-drag')}
            style={btnStyle}
            onClick={() => {
              ipcBrowserChange(winMax ? 'window-mix' : 'window-max')
              setWinMax(!winMax)
            }}>
            <Icon type={winMax ? 'yp-zuidahua' : 'yp-zuidahua1'} size={18}/>
          </div>
          <div
            className={classNames(styles.itemBtn ,'no-drag')}
            style={btnStyle}
            onClick={() => ipcBrowserChange('window-hide')}>
            <Icon type="yp-close" size={18}/>
          </div>
        </div>
      }
    </div>
  )
}

DragBox.defaultProps = {
  hideControlBar: false,
}

export default DragBox

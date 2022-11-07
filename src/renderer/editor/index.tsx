/*
 * @Author: penglei
 * @Date: 2022-09-09 14:54:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-07 17:02:52
 * @Description: 富文本组件
 */
import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from "react"
import classNames from 'classnames'
import { Tooltip } from 'antd'
import { Icon, Image } from '@/components'
import emoji from './config/emoji'
import { emojiPath } from './utils'
import { ItemType, IEditInputRef } from './types'
import EditInput from './edit-input'

import styles from './index.module.scss'


export interface IEditorProps {
  // 键盘回车事件
  enterDown?: () => void
  // 输入框内容变化时的回调
  onChange?: (val: string) => void
  /** 扩展类名 */
  className?: string
}

export interface IEditRef extends IEditInputRef {

}

const getEmojiData = () => {
  const data: ItemType[] = []
  for (const i in emoji) {
    const bli = i.replace("[", '')
    const cli = bli.replace("]", '')
    data.push({
      url: emojiPath(emoji[i]),
      name: i,
      title: cli,
      width: 20,
      height: 20
    })
  }
  return data
}

// 表情数据
const data = getEmojiData()

// 富文本组件
const Editor = forwardRef<IEditRef, IEditorProps>((props, ref) => {
  // 解析值
  const {className: _className} = props
  // 输入框控制器
  const editInputRef = useRef<IEditInputRef>(null)
  // 显示表情弹窗
  const [openEmoji, setOpen] = useState<boolean>(false)

  // 暴露更新聊天记录的方法，给父组件调用
  useImperativeHandle(ref,
    () => ({
      ...editInputRef.current
    })
  )

  // 设置表情弹窗显示隐藏
  const setOpenEmojiState = () => {
    setOpen(false)
  }

  useEffect(() => {
    // 点击隐藏，弹窗
    document.addEventListener('click', setOpenEmojiState)
    return () => {
      // 注销事件
      document.removeEventListener('click', setOpenEmojiState)
    }
  }, [])

  // 点击回车事件，暴露给外面
  const enterDownClick = useCallback(() => {
    props?.enterDown?.()
  }, [props?.enterDown])

  const editInputClick = useCallback(() => {
    setOpen(false)
  }, [])

  const editChange = useCallback((v) => {
    props?.onChange?.(v)
  }, [props?.onChange])

  return (
    <div className={classNames(styles['editor-box'], _className)}>
      {/* 功能区 */}
      <ul className={styles['tool-bar']} onClick={(e) => e.stopPropagation()}>
        <Tooltip title="表情" overlayClassName={'emote-tip unselectable'}>
          <li className={classNames(styles['tool-item'], 'unselectable')} onClick={(e) => {
            e.stopPropagation()
            setOpen(!openEmoji)
          }}>
            <Icon type='yp-biaoqing-xue' size={18} className={styles['emote']}/>
          </li>
        </Tooltip>
        {/* 表情选择列表 */}
        <div className={styles['emote-box']} style={{display: openEmoji ? 'block' : 'none'}}>
          <div className={styles['emoji-panel-scroller']}>
            <div className={styles['emoji-container-new']}>
              { data?.map((item, index) =>
                <Tooltip title={item.title} overlayClassName={'emote-tip unselectable'} key={`emoji-item-${index}`}>
                  <div className={classNames(styles['emoji-item'], 'unselectable')} onClick={() => {
                    setOpen(false)
                    editInputRef.current?.chooseEmoji(item)
                  }}>
                    <Image src={item.url} className={styles['emoji-panel']} width={22} height={22}/>
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
          <div className={styles['sticker-set-toolbar']}>
            <div className={classNames(styles['scroller-item'], 'unselectable')}>
              <Image src={require( `@/assets/imgs/emoji-icon.png`)} className={styles['emoji-img']} width={20} height={20}/>
            </div>
          </div>
        </div>
      </ul>
      {/* 编辑框 */}
      <EditInput
        ref={editInputRef}
        onChange={editChange}
        enterDown={enterDownClick}
        click={editInputClick}/>
    </div>
  )
})

export default Editor

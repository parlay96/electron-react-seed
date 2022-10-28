/*
 * @Author: penglei
 * @Date: 2022-09-09 14:54:35
 * @LastEditors: penglei
 * @LastEditTime: 2022-10-27 21:13:23
 * @Description: 输入框
 */
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react"
import type { ItemType, IEditInputRef } from './types'
import { handleCopyEvent, handleEditValue, handleInputChange, emojiLabel, labelRep } from './utils'

import styles from './index.module.scss'

interface IEditInputType {
  // 输入框点击事件
  click?: () => void
  // 键盘回车事件
  enterDown?: () => void
  // 输入框内容变化时的回调
  onChange?: (val: string) => void
}

let currentSelection: {startContainer?: any, startOffset: number, endContainer?: any, endOffset: number} = {
  startContainer: null,
  startOffset: 0,
  endContainer: null,
  endOffset: 0
}

let isFlag = false // 输入框输入时的标志，用来判断的

// 消息输入框
const EditInput = forwardRef<IEditInputRef, IEditInputType>((props, ref) => {
  // 用于操作聊天输入框元素
  const editRef = useRef(null)
  // 最后一次输入框的内容
  const lastHtml = useRef<string>('')
  // 提示文本
  const [tipHolder, setTipHolder] = useState<string>('请输入发送的消息')

  // 初始化
  useEffect(() => { init() }, [])

  // 暴露更新聊天记录的方法，给父组件调用
  useImperativeHandle(ref,
    () => ({
      chooseEmoji: async (item: ItemType) => await addEmoji(item),
      getValue: async () => {
        const msgValue = await handleEditValue(editRef.current)
        // 如果输入的内容去除所有空格，还是个空，代表没输入东西
        const reg = /\s+/g
        const isFlags = msgValue.replace(reg,'') == ''
        // 返回输入框信息
        return isFlags ? null : msgValue
      },
      clear: async () => { editRef.current.innerHTML = '' },
      focus: async () => await init(),
      setPlaceholder: async (val) => setTipHolder(val || '请输入发送的消息'),
    })
  )

  // 初始化编辑器
  const init = async () => {
    const editor = editRef.current
    if (!editor) return
    editRef.current.innerHTML = ''
    // 光标位置为开头
    currentSelection = {
      startContainer: editor,
      startOffset: 0,
      endContainer: editor,
      endOffset: 0
    }
    // 设置光标位置
    restorerange()
  }

  // 设置光标位置
  const restorerange = () => {
    if (currentSelection) {
      // 用户选择的文本范围或光标的当前位置
      const selection = window.getSelection()
      // 清除选定对象的所有光标对象
      selection.removeAllRanges()
      // 创建新的光标对象
      const range = document.createRange()
      // 设置光标位置
      range.setStart(currentSelection.startContainer, currentSelection.startOffset)
      range.setEnd(currentSelection.endContainer, currentSelection.endOffset)
      // 向选区中添加一个区域
      selection.addRange(range)
    }
  }

  // 备份当前光标位置
  const backuprange = async () => {
    // 用户选择的文本范围或光标的当前位置
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      // 获取当前光标
      const range = selection.getRangeAt(0)
      currentSelection = {
        startContainer: range.startContainer,
        // range.startOffset 是一个只读属性，用于返回一个表示 Range 在 startContainer 中的起始位置的数字。
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      }
    }
  }

  // 失去焦点
  const editorBlur = () => {
    // 备份当前光标位置
    backuprange()
  }

  // 获取焦点
  const editorFocus = (e) => {
    // console.log(e)
  }

  /**
   * @输入框值变化onChange事件
   *  contentEditable的onChange事件默认是没有的，只要onInput事件。这里我们通过新旧值对比
   * 如果最后一次记录的值，和现在的值，不一致。才触发onChange事件
   * https://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable/27255103#27255103
   */
  const editorInput = (e) => {
    const curHtml = editRef.current.innerHTML || ''
    if (curHtml !== lastHtml.current && !isFlag) {
      lastHtml.current = curHtml
      // 如果内容是匹配成功，代表无值
      const iReg = /<br><i.*?(\/i>)/gi // <br><i id="editorFocusHack16667912636241tq31j96"></i>
      // 输入框值
      const _html = e?.target?.innerHTML
      // 匹配成功？
      const nullText = _html?.replace(iReg, '')
      // console.log(_html.match(iReg))
      // console.log(_html, '-----', nullText == '')
      // 防止文本为空，还不出现placeholder提示1
      if (_html == '<br>' || nullText == '') {
        editRef.current.innerHTML = ''
        props?.onChange?.('')
      } else {
        isFlag = true
        // 转换输入框的内容
        handleInputChange(editRef.current, async () => {
          // 转换完了，主动触发输入框值变化
          const val = await handleEditValue(editRef.current)
          props?.onChange?.(val)
          isFlag = false
        })
      }
    }
  }

  // 选择插入表情/图片
  const addEmoji = async (item: ItemType) => {
    const node = new Image()
    node.src = item.url
    node.setAttribute('style', `width: ${item.width}px;height:${item.height}px`)
    // 插入表情的时候，加上唯一标识。然后再复制（onCopy事件）的时候处理图片。
    node.setAttribute(emojiLabel.key, item.name)

    if(currentSelection.startContainer.nodeType == 3){
      // 如果是文本节点，拆分文字
      const newNode = currentSelection.startContainer?.splitText(currentSelection.startOffset)
      // 设置光标开始节点为拆分之后节点的父级节点
      currentSelection.startContainer = newNode.parentNode
      // 在拆分后得到的节点之前插入图片
      currentSelection.startContainer.insertBefore(node, newNode)
    } else {
      // 非文本节点
      if(currentSelection.startContainer.childNodes.length){
        // 如果光标开始节点下有子级，获取到光标位置的节点
        const beforeNode = currentSelection.startContainer.childNodes[currentSelection.startOffset]
        // 插入
        currentSelection.startContainer.insertBefore(node, beforeNode)
      }else{
        // 如果光标开始节点下没有子级，直接插入
        currentSelection.startContainer.appendChild(node)
      }
    }

    // 获取插入的节点所在父级下的位置
    // const index = Array.from(currentSelection.startContainer.childNodes).indexOf(node)
    // currentSelection.startOffset = index + 1
    // currentSelection.endOffset = index + 1

    // 视图滚动带完全显示出来
    node.scrollIntoView(false)

    await setRangeNodeFocus(node, 'after')

    // 触发消息变化事件
    props?.onChange(editRef?.current?.innerHTML)
  }

  // 粘贴事件
  const editorPaste = (e) => {
    // 阻止默认事件
    e.preventDefault()
    // 获取粘贴的内容
    const clp = e.clipboardData || e.originalEvent && e.originalEvent.clipboardData
    const isFile = clp?.types?.includes('File')
    const isHtml = clp?.types?.includes('text/html')
    const isPlain = clp?.types?.includes('text/plain')
    let content = ''
    // 如果是粘贴的是文件
    if (isFile && !isHtml && !isPlain) {
      // console.log(clp.types)
    } else if ((isHtml || isPlain) && !isFile) {
      // 如果是粘贴的是文本
      content = clp.getData('text/plain')
    }
    if (content) {
      // 解析内容替换, labelRep -> 字符串标签特殊字符转换
      document.execCommand("insertHTML", !1, labelRep(content))
      // 滚动到对应的地方
      scrollRangSite()
    }
  }

  // 点击输入框事件（点击时）
  const editorClick = (e) => {
    // 点击时，如果点击到的是图片需要吧当前光标变为点击图片的前面
    const target = e?.target
    if (target?.nodeName == 'IMG') {
      setRangeNodeFocus(target, 'before')
    }
  }

  // 输入框键盘按下事件
  const editorKeydown = (event) => {
    const keyCode = event.keyCode
    // ctrl + Enter换行
    if (event.ctrlKey && keyCode === 13) {
      // 阻止默认事件
      event.preventDefault()
      // 阻止事件冒泡
      event.stopPropagation()
      // 插入换行符
      amendEmptyLine()
    } else if (keyCode === 13) {
      // Enter发生消息
      // 阻止默认事件
      event.preventDefault()
      // 阻止事件冒泡
      event.stopPropagation()
      // 执行回车事件给父组件
      props?.enterDown()
    }
  }

  // 插入换行符
  const amendEmptyLine = () => {
    // 创建一个空文本节点
    const textNode = document.createTextNode("\n" + ' ')
    // 获取页面的选择区域
    const selection = document.getSelection()
    // 必须存在光标
    if(selection.rangeCount > 0 ){
      // 获取当前光标
      const range = selection.getRangeAt(0)
      // 在光标的，起始位置插入节点的方法
      range.insertNode(textNode)
      // 给当前文本获取焦点
      setRangeNodeFocus(textNode, 'after')
      // 滚动到对应的地方
      scrollRangSite()
    }
  }

  // 滚动插入内容后的最新光标位置
  const scrollRangSite = () => {
    const t = "editorFocusHackSpan" + (new Date).getTime()
    // 滚动到对应的地方
    document.execCommand("insertHTML", !1, '<i id="' + t + '"></i>')
    const n = document.getElementById(t)
    n?.scrollIntoView(!0)
    // 删除节点
    n?.remove()
  }

  // 设置当前光标在某个节点的位置, 并获取焦点
  const setRangeNodeFocus = async (node, type: 'before' | 'after') => {
    // 用户选择的文本范围或光标的当前位置
    const selection = window.getSelection()
    // 创建新的光标对象
    const range = document.createRange()
    // setStartAfter方法在指定的节点之后开始范围(指定的节点之后开始范围)
    type == 'after' && range.setStartAfter(node)
    // setStartBefore方法在指定的节点之前开始范围(指定的节点之前开始范围)
    type == 'before' && range.setStartBefore(node)
    // 使光标开始和光标结束重叠
    range.collapse(true)
    // 清除选定对象的所有光标对象
    selection.removeAllRanges()
    // 插入新的光标对象
    selection.addRange(range)
    // 重新聚焦输入框
    editRef?.current?.focus()
  }

  return (
    <div className={styles['edit-box']}>
      <pre className={styles['input-msg-box']}
        ref={editRef}
        contentEditable
        spellCheck
        placeholder={tipHolder}
        onPaste={editorPaste}
        onBlur={editorBlur}
        onFocus={editorFocus}
        onInput={editorInput}
        onCopy={handleCopyEvent}
        onKeyDown={editorKeydown}
        onClick={(e) => {
          editorClick(e)
          props?.click?.()
        }}
        onDrop={(e) => {
          // 禁用拖放操作, 如果拖动输入框内的图片，会导致吧图片的地址输入到 富文本中
          e.preventDefault()
          return false
        }}
        onDragOver={(e) => {
          // 禁用拖放操作， 如果拖动输入框内的图片，会导致吧图片的地址输入到 富文本中
          e.preventDefault()
          return false
        }}>
      </pre>
    </div>
  )
})

export default EditInput

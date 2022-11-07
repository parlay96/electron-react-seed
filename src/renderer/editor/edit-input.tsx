/*
 * @Author: penglei
 * @Date: 2022-09-09 14:54:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-07 20:28:43
 * @Description: 输入框
 */
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react"
import type { ItemType, IEditInputRef } from './types'
import { handleCopyEvent, handleEditValue, handleInputChange, emojiLabel, labelRep, regContentImg } from './utils'

import styles from './index.module.scss'

interface IEditInputType {
  // 输入框里面默认的表情图片大小
  emojiSize?: number
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
let isPasteFlag = false // 标记我是粘贴时 | 或者是我手动更改输入框值得时候，用来判断的
/**
 * https://blog.csdn.net/weixin_45936690/article/details/121654517
 * @contentEditable输入框，遇见的问题：
 * 1.有些输入法输入中文 || 输入特殊字符时我还在输入拼音时，输入还没结束；会不停的触发onInput事件。导致onInput事件方法里面出现bug
 * 2. 而有些输入框中文时不会触发onInput：如搜狗输入法
 * 3. 我们需要做个判断 1.onCompositionStart： 启动新的合成会话时，会触发该事件。 例如，可以在用户开始使用拼音IME 输入中文字符后触发此事件
 * 4. 2. onCompositionEnd 完成或取消当前合成会话时，将触发该事件。例如，可以在用户使用拼音IME 完成输入中文字符后触发此事件
 * 我们在onCompositionStart：是标记正在输入中，必须等onCompositionEnd结束后主动去触发onInput
 */
let isLock = false

// 消息输入框
const EditInput = forwardRef<IEditInputRef, IEditInputType>((props, ref) => {
  // 用于操作聊天输入框元素
  const editRef = useRef(null)
  // 提示文本
  const [tipHolder, setTipHolder] = useState<string>('请输入发送的消息')

  // 初始化
  useEffect(() => {
    init()
  }, [])

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
      setValue: async (val) => {
        if (!val || !editRef.current) return
        // 把文本标签转义：如<div>[爱心]</div> 把这个文本转义为"&lt;div&lt;", newCurrentText 当前光标的节点元素的值
        const repContent = labelRep(val)
        // 把表情文本转换为图片,
        const htmlNodeStr = regContentImg(repContent, props?.emojiSize)
        editRef.current.innerHTML = htmlNodeStr
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
   */
  const editorInput = (e) => {
    // 表示正在输入中文，还没输入完毕，不能执行下面逻辑  ||  必须等到转换完成，才继续执行
    if (isLock || isFlag) return

    // 如果内容是匹配成功，代表无值
    const iReg = /<br><i.*?(\/i>)/gi // <br><i id="editorFocusHack16667912636241tq31j96"></i>
    // 输入框值
    const _html = e?.target?.innerHTML
    // 匹配成功？
    const nullText = _html?.replace(iReg, '')
    // console.log(_html.match(iReg))
    // console.log(_html, '-----', nullText == '')
    // 防止文本为空，还不出现placeholder提示
    if (_html == '<br>' || nullText == '') {
      editRef.current.innerHTML = ''
      props?.onChange?.('')
      return
    // 如果是粘贴事件，粘贴完毕会触发，这个输入框变化事件。
    } else if (isPasteFlag) {
      // 标记必须等到转换完成，才继续开启状态
      isFlag = true
      // 1.如果是粘贴事件，粘贴完毕会触发，这个输入框变化事件。
      // 2.粘贴就不执行下面else的逻辑，去匹配替换字符串的逻辑，因为这一步我们在editorPaste时解决了。
      // 3.我们主动改变会状态，变为不是粘贴时
      // 获取值
      handleEditValue(editRef.current).then(data => {
        props?.onChange?.(data)
        isPasteFlag = false
        // 必须等到转换完成，才继续开启状态
        isFlag = false
      })
      return
    } else {
      // 标记正在输入转换，必须等到转换完成，才继续开启状态
      isFlag = true
      // 转换输入框的内容
      handleInputChange(editRef.current, props?.emojiSize, async () => {
        // 获取输入框的值，主动触发输入框值变化
        const val = await handleEditValue(editRef.current)
        props?.onChange?.(val)
        // 必须等到转换完成，才继续开启状态
        isFlag = false
      })
    }
  }

  // 选择插入表情/图片
  const addEmoji = async (item: ItemType) => {
    const node = new Image()
    node.src = item.url
    node.setAttribute('style', `width: ${props?.emojiSize}px;height:${props?.emojiSize}px`)
    // 插入表情的时候，加上唯一标识。然后再复制（onCopy事件）的时候处理图片。
    node.setAttribute(emojiLabel.key, item.name)

    if (currentSelection.startContainer?.nodeType == 3) {
      // 如果是文本节点，拆分文字
      const newNode = currentSelection.startContainer?.splitText(currentSelection.startOffset)
      // 设置光标开始节点为拆分之后节点的父级节点
      currentSelection.startContainer = newNode.parentNode
      // 在拆分后得到的节点之前插入图片
      currentSelection.startContainer.insertBefore(node, newNode)
    } else {
      // 非文本节点
      if(currentSelection.startContainer?.childNodes.length){
        // 如果光标开始节点下有子级，获取到光标位置的节点
        const beforeNode = currentSelection.startContainer.childNodes[currentSelection.startOffset]
        // 插入
        currentSelection.startContainer.insertBefore(node, beforeNode)
      } else {
        // 如果光标开始节点下没有子级，直接插入
        currentSelection.startContainer?.appendChild(node)
      }
    }

    // 获取插入的节点所在父级下的位置
    // const index = Array.from(currentSelection.startContainer.childNodes).indexOf(node)
    // currentSelection.startOffset = index + 1
    // currentSelection.endOffset = index + 1

    // 视图滚动带完全显示出来
    node.scrollIntoView(false)
    // 设置焦点
    await setRangeNodeFocus(node, 'after')
    // 转换完了，主动触发输入框值变化
    const val = await handleEditValue(editRef.current)
    props?.onChange?.(val)
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
      // 把文本标签转义：如<div>[爱心]</div> 把这个文本转义为"&lt;div&lt;", newCurrentText 当前光标的节点元素的值
      const repContent = labelRep(content)
      // 把表情文本转换为图片,
      const htmlNodeStr = regContentImg(repContent, props?.emojiSize)
      // 标记我是粘贴时，不能触发输入框变化事件（editorInput）
      isPasteFlag = true
      // 解析内容替换, labelRep -> 字符串标签特殊字符转换
      document.execCommand("insertHTML", !1, htmlNodeStr)
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

  // 滚动插入内容后的最新光标位置12
  const scrollRangSite = () => {
    const t = "editorFocusHackSpan" + (new Date).getTime()
    // 标记我是粘贴时 | 或者是我手动更改输入框值得时候，不能触发输入框变化事件（editorInput）
    isPasteFlag = true
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
        onCompositionStart={(e) => {
          // 标记正在输入中文
          isLock = true
        }}
        onCompositionEnd={(e) => {
          // 标记正在输入中文, 结束以后再去触发onInput
          isLock = false
          // 在调用
          editorInput(e)
        }}
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

EditInput.defaultProps = {
  emojiSize: 18
}

export default EditInput

/*
 * @Date: 2022-10-22 10:31:08
 * @Description: 富文本输入框操作
 */
let timer = null

import { emojiLabel, regContentImg, labelRep, getRandomWord } from '.'

/** @处理复制事件 */
export const handleCopyEvent = (event) => {
  let content = ''
  //阻止默认事件，防止复制真实发生
  event.preventDefault()
  // 用户选择的文本范围或光标的当前位置
  const selection = window.getSelection()
  if (selection.rangeCount > 0) {
    // 获取当前光标选中的内容，我们需要吧复制的内容转换一次
    // cloneContents很关键，获取选中的文档碎片（此方法返回从Range的内容创建的DocumentFragment对象）
    const docFragment = selection.getRangeAt(0).cloneContents()
    const oDiv = document.createElement('div')
    // 将选中的htmlcopy给新建的div
    oDiv.appendChild(docFragment)
    // 遍历节点
    oDiv?.childNodes?.forEach((item: any) => {
      const emojiImgName = item?.dataset?.[emojiLabel.value] || { [emojiLabel.value]: ''}
      // 如果是文本节点
      if (item.nodeType == 3) {
        content += item?.nodeValue
        // 如果是图片就取节点上面的属性字段， 取出表情图片对呀的文本
      } else if (item.nodeType == 1 && item.nodeName == 'IMG' && emojiImgName) {
        content += emojiImgName
        // 如果是DIV，那就换行（基本不可能出现这个情况，输入框只可能出现文本节点。和img节点）
      } else if (item.nodeType == 1 && item.nodeName == "DIV" && item.innerHTML) {
      // 如果输入的内容去除所有空格，还是个空，代表没输入东西
        const reg = /\s+/g
        const isFlags = item.innerHTML.replace(reg,'') == ''
        // 因为可能是个空DIV
        if (!isFlags) {
          content += '\n ' + item.innerHTML
        }
      }
    })
    // 手动重新设置复制的内容
    if (content) {
      event.clipboardData?.setData("text/plain", content)
    }
  }
}

/** @处理获取文本内容 */
export const handleEditValue = async (editNode) => {
  let content = ''
  if (!editNode) return ''
  // 获取当前子节点集合，找出输入的内容, 且过滤
  // console.log(editNode?.childNodes)
  editNode?.childNodes?.forEach(item => {
    const emojiImgName = item?.dataset?.[emojiLabel.value] || { [emojiLabel.value]: ''}
    // 如果是文本节点
    if (item.nodeType == 3) {
      content += item?.nodeValue
      // 如果是图片就取节点上面的属性字段, 取出表情图片对呀的文本
    } else if (item.nodeType == 1 && item.nodeName == 'IMG' && emojiImgName) {
      content += emojiImgName
      // 如果是DIV，那就换行（基本不可能出现这个情况，输入框只可能出现文本节点。和img节点）
    } else if (item.nodeType == 1 && item.nodeName == "DIV" && item.innerHTML) {
      // 如果输入的内容去除所有空格，还是个空，代表没输入东西
      const reg = /\s+/g
      const isFlags = item.innerHTML.replace(reg,'') == ''
      // 因为可能是个空DIV
      if (!isFlags) {
        content += '\n ' + item.innerHTML
      }
    }
  })
  return content
}

/**
 *  @处理输入框的值
 * 把输入的文字转换成图片
 */
export const handleInputChange = (editNode, callBack: () => void) => {
  // 清除定时器
  clearTimeout(timer)
  // 获取全部子节点
  const { childNodes = [] } = editNode
  // 光标的当前位置
  const selection = window.getSelection()
  // 当前光标节点，在富文本中的索引
  let rangeNodeIndex = -1
  // 必须存在光标
  if(selection.rangeCount == 0 ) return callBack()

  // 返回目标节点的共有祖先节点
  const currContent = selection.getRangeAt(0).commonAncestorContainer
  // 找出当前光标节点在dom中的位置
  childNodes.forEach((curr, index) => {
    if (curr == currContent) rangeNodeIndex = index
  })
  // 没有找到  || 如果当前节点不存在文本内容，代表不是文本节点，直接返回
  if (rangeNodeIndex == -1 || !currContent.nodeValue) return callBack()


  // 根据当前光标位置，找到对应文本位置，因为这个位置代表新插入的内容结束位置
  // 然后再结束的位置，插入转义后需要焦点目前的标签I。因为我们需要插入后吧光标焦点到插入内容的后面。
  const start = selection.anchorOffset //开始位置
  const end = selection.focusOffset  //结束位置
  // 光标在当前节点中后面的内容
  let afterText = currContent.nodeValue.substring(0, end)
  // 光标在当前节点中前面的内容
  const beforeText = currContent.nodeValue.substring(end)
  // 吧当前光标位置内容前面 拼接 上 一个I 标签，有利于 我们后面去定位光标位置。
  const keyId = 'editorFocusHack' + (new Date).getTime() + getRandomWord(8)
  // 我们这里先给个唯一的ID字符串，等转义完毕我们在吧这个ID替换为I标签
  // 避免最开始就把我I标签转义为"&lt; i &lt;"
  // afterText += '<i id="' + keyId + '"></i>'
  afterText += `id=${keyId}`
  // 新的文本内容（下面用这个新的去转义）这一步非常的重要
  const newCurrentText = afterText + beforeText
  // console.log(currContent.nodeValue, afterText, beforeText, newCurrentText)


  // 构建新的html
  {
    let htmlNodeStr = '' // 新的节点字符串
    // 把文本标签转义：如<div>11</div> 把这个文本转义为"&lt;div&lt;", newCurrentText 当前光标的节点元素的值
    const repContent = labelRep(newCurrentText)
    // 把上面的id唯一标识的字符串转换为 I 标签
    const newContent = repContent.replace(`id=${keyId}`, '<i id="' + keyId + '"></i>')
    // console.log(newContent)
    // debugger

    // 遍历节点，重新组装新的html
    childNodes.forEach((curr, index) => {
      // 光标节点索引，等于新节点，就替换内容
      if (index == rangeNodeIndex) {
        // 把表情文本转换为图片,
        htmlNodeStr += regContentImg(newContent)
        // 防止插入I标签, 插入的时候可能会插入I标签。
      } else if (curr.nodeName !== 'I') {
        if (curr.nodeName == "IMG") {
          htmlNodeStr += curr.outerHTML
        } else {
          // 把文本再次转义
          const transfNode = labelRep(curr.data)
          // 转换图片
          htmlNodeStr += regContentImg(transfNode)
        }
      }
    })

    // 把新的内容重新给dom (onInput事件特殊字符输入，会触发2次事件。我们这里延迟赋值下，不然有bug)
    // 不加延迟中文输入框，输入域特殊字符：【 】 ； ‘ 、 ，。 、 都会触发2次onInput事件，
    // 导致 editNode.innerHTML = htmlNodeStr 设置完值，会出现重复问题。

    // editNode.innerHTML = htmlNodeStr
    // callBack()

    timer = setTimeout(() => {
      // 把转换后的html，重新设置给输入框内容
      editNode.innerHTML = htmlNodeStr

      // 当设置当前光标
      const selection = window.getSelection()
      const range = document.createRange()
      // 获取光标节点
      const focusNode = document.getElementById(keyId)
      // 滚动
      focusNode?.scrollIntoView(!0)
      // 设置光标为当前节点
      range.setStartAfter(focusNode)
      range.collapse(true)
      // 删除全部光标
      selection.removeAllRanges()
      // 添加新光标
      selection.addRange(range)
      // 执行回调，一切全部完成
      callBack()

    }, 0)
  }

}

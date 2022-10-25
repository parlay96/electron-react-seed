/*
 * @Date: 2022-10-22 10:31:08
 * @Description: 富文本输入框操作
 */
import { emojiLabel } from '.'

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
        // 如果是DIV，那就换行
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
      // 如果是DIV，那就换行
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
export const handleInputChange = (editNode) => {
  const { childNodes = [] } = editNode
  const nodelength = childNodes.length
  // 光标的当前位置
  const selection = window.getSelection()
  // 当前光标节点，在富文本中的索引
  let rangeNodeIndex = -1
  // 必须存在光标
  if(selection.rangeCount == 0 ) return
  // 返回目标节点的共有祖先节点
  const currContent = selection.getRangeAt(0).commonAncestorContainer

  childNodes.forEach((curr, index) => {
    if (curr == currContent) rangeNodeIndex = index
  })
  {
    const htmlNodeStr = `` // 新的节点字符串
    // 如果当前节点不存在文本内容，代表不是文本节点，直接返回
    if (!currContent.nodeValue) return

  }
  // 转换值
  // editNode?.childNodes?.forEach((item: any) => {
  //   // 如果是文本节点
  //   if (item.nodeType == 3) {
  //     const node_html = ImUtils.RegContent(item.textContent)
  //     if (item.textContent !== node_html) {
  //       // 把字符串转成节点
  //       const new_node = document.createRange().createContextualFragment(node_html)
  //       // 替换
  //       editNode.replaceChild(new_node, item)
  //       replaceNode = new_node
  //     }
  //   }
  // })
  // return replaceNode
}

/*
 * @Date: 2022-09-22 16:42:11
 * @Description: 消息类型转换
 */

import { regContentImg, emojiLabel, labelRep } from '@/editor/utils'

/** 消息类型字典表 */
export const msgTypeDict = {
  'TEXT': 'text',
  'IMAGE': 'img',
  'VOICE': 'audio',
  'FILE': 'file'
}

/**
 * 文本消息转换，批量替换方法
 * @strCont 消息字符串
 */
export const regContent = (strCont?: string) => {
  // 文本转换批量图片替换方法
  const newStrCont = regContentImg(strCont)
  /**
   * 把字符串消息内容转格式：
   * 1. 把换行符分割，转为数组
   * 3. 遍历数组，找出字符串中带有图片的文本，转出来
   * 4. 如果是文本，解析为html字符串
   * 5. 完成转成后，渲染消息列表会用pre标签进行渲染(<pre dangerouslySetInnerHTML={{__html: msg}}>)，pre标签：<pre> 标签可定义预格式化的文本。
        被包围在 <pre> 标签 元素中的文本通常会保留空格和换行符。而文本也会呈现为等宽字体。
   */

  // const msgData = [] // 不使用push到数组中了，这样会导致多遍历一次,但是下面遍历中的代码并没有删除，后续可以放出来查看
  // 下面遍历中，我们并没有吧查询到符合的文本，重新装入msgData数组中，而是直接返回了字符串，其实就是为了不多遍历一次
  // 当然我们可以看出来大概的意思。你也可以注释开，查看过程！
  const data = newStrCont?.split('\n')?.map(msgStr => {
    let str = ''
    const imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
    // 筛选出所有的img
    const imgArr = msgStr.match(imgReg)
    // 代表当前存在图片表情，继续匹配
    if (msgStr?.indexOf(emojiLabel.key) !== -1 && imgArr?.length) {
      let cMsg = msgStr // 最新的字符串
      // 发现图片, 循环添加
      for (let i = 0; i < imgArr.length; i++) {
        // 找到图片，做字符串分割，直到分割完毕位置
        const ds = cMsg?.split(imgArr[i])
        /**
       * 把剩下文本在次装进入消息数组中，什么意思？
       * 如：<div><img src="/static/imgs/[愉快].png" ${emojiLabel.key}="[愉快]" />哈哈
       * <img src="/static/imgs/[愉快].png" ${emojiLabel.key}="[愉快]" />哈</div>
       * 我们需要得到的是数组: [
       *  '<div>',
       *  '<img src="/static/imgs/[愉快].png" ${emojiLabel.key}="[愉快]" />',
       *  '哈哈',
       *  '<img src="/static/imgs/[愉快].png" ${emojiLabel.key}="[愉快]" />',
       *  '哈</div>'
       * ]
       *
       */
        // 组装字符串规则： 文本就需要加上span标签，否侧就是表情图片，直接显示img标签
        // 如果是最后一个字符：就需要加上换行: <span>\n</span>
        if (ds?.length) {
          // 把截取的第一值直接存进消息数组，因为这代表是图片前面的文字
          if (ds[0]) {
            str += `<span>${labelRep(ds[0])}</span>`
            // msgData.push({ type: 'text', value: labelRep(ds[0] || ''), isRow: false })
          }

          // (isRow  必须是最后一次截取，且结尾的字符是空，才代表当前图片已经是最后一个字符，就需要换行)
          const isFlag = imgArr.length - 1 == i && !ds[1]
          // 把当前图片装进去
          str += isFlag ? `${imgArr[i]}<span>\n</span>` : `${imgArr[i]}`
          // msgData.push( { type: 'img', value: imgArr[i], isRow: imgArr.length - 1 == i && !ds[1] })

          // 如果循环到最后一个，就把最后一个结尾的字符装进去
          if (imgArr.length - 1 == i && ds[1]) {
            str += `<span>${labelRep(ds[1])}</span><span>\n</span>`
            // msgData.push({ type: 'text', value: labelRep(ds[1]), isRow: true })
          } else {
            // 把字符串当前装进去的文字，删除掉，防止下次继续分隔。相对于分隔后面的就是下次要截取的！
            cMsg = ds[1]
          }
        }
      }
    } else {
      // 没有找到图片就当文本处理
      if (msgStr) {
        // 如果是最后一个字符：就需要加上换行: <span>\n</span>
        str += `<span>${labelRep(msgStr)}</span><span>\n</span>`
        // msgData.push({ type: 'text', value: labelRep(msgStr), isRow: true })
      }
    }

    return str
  })

  // 新消息html字符串, 这样写多遍历一次，上面循环直接返回字符串了
  // const htmlMsg= msgData?.map(item => {
  //   let str = ''
  //   // 表示是独行，需要换行
  //   if (item?.isRow) {
  //     // 文本就需要加上span标签，否侧就是表情图片，直接显示img标签
  //     str = item.type == 'text' ? `<span>${item.value}</span><span>\n</span>` : `${item.value}<span>\n</span>`
  //   } else {
  //     str = item.type == 'text' ? `<span>${item.value}</span>` : `${item.value}`
  //   }
  //   return str
  // })?.join('')

  // console.log(data)

  return data?.join('')
}

/**
 * 会话列表-> 消息类型转换
 * 这个是左侧的会话列表消息转换，左侧除了文本消息展示实际内容，其他消息，都使用缩写描述！
 */
export const convTypeTf = (obj) => {
  if (obj?.type == 'txt' || obj?.type == 'text') {
    // 转换文本
    return regContent(obj.msg)
  }
  if (obj?.type == 'audio') {
    return '[语音]'
  }
  if (obj?.type == 'img') {
    return '[图片]'
  }
  if (obj?.type == 'custom') {
    return '[自定义消息]'
  }
  if (obj?.type == 'file') {
    return '[文件]'
  }
  if (obj?.type == 'video') {
    return '[视频]'
  }
  return '消息格式暂不支持，请前往客户端...'
}


/**
 * 聊天列表-> 消息转换
 * 这个是右侧的会话列表消息转换，右侧需要吧消息正常转换除了，不像左侧会话列表，只需要缩写
 */
export const chatTypeTf = (obj: any) => {
  const type = msgTypeDict[obj.contentsType]
  if (type == 'text') {
    // 转换文本
    return regContent(obj.data)
  }
  if (type == 'audio') {
    return '[语音]'
  }
  if (type == 'img') {
    return obj.url
  }
  if (type == 'custom') {
    return '[自定义]'
  }
  if (type == 'file') {
    return '[文件]'
  }
  if (type == 'video') {
    return '[视频]'
  }
  return '消息格式暂不支持，请前往客户端...'
}

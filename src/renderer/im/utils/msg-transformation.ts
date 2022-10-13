/*
 * @Date: 2022-09-22 16:42:11
 * @Description: 消息类型转换
 */

import emoji from '../config/emoji'

/** 消息类型字典表 */
export const msgTypeDict = {
  'TEXT': 'text',
  'IMAGE': 'img',
  'VOICE': 'audio',
  'FILE': 'file'
}

/** 转换图片路径 */
const transformImgPath = (imgName) => require(`@/im/themes/faces/${imgName}`)

/**
 * 会话列表-> 消息类型转换
 * 这个是左侧的会话列表消息转换，左侧除了文本消息展示实际内容，其他消息，都使用缩写描述！
 */
export const convTypeTf = (obj) => {
  if (obj?.type == 'txt' || obj?.type == 'text') {
    // 转换文本
    return RegContent(obj.msg)
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
 * 转换文本，批量替换方法
 * @strCont 字符串
 * @imgSize 表情的大小
 */
export const RegContent = (strCont?: string, imgSize?: number) => {
  for (const i in emoji) {
    // 替换换行
    const regWrap = new RegExp('\\'+ '\n', "g")
    strCont = strCont.replace(regWrap, '<br>')
    // 替换表情
    const strimg= `<img src="${transformImgPath(emoji[i])}" width="${imgSize || 16}px" height="${imgSize || 16}px">`
    const reg= new RegExp("\\"+ i, "g")
    strCont = strCont.replace(reg, strimg)
  }
  return strCont
}


/**
 * 聊天列表-> 消息转换
 * 这个是右侧的会话列表消息转换，右侧需要吧消息正常转换除了，不像左侧会话列表，只需要缩写
 */
export const chatTypeTf = (obj: any) => {
  const type = msgTypeDict[obj.contentsType]
  if (type == 'text') {
    // 转换文本
    return RegContent(obj.data)
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

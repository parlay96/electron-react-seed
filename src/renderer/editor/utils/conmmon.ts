/*
 * @Date: 2022-10-25 18:15:32
 * @Description: file content
 */
import emoji from '../config/emoji'

/** 表情图片的 标签扩展属性名称 */
export const emojiLabel= {
  key: 'data-ypgcy-emoji-img-name',
  value: 'ypgcyEmojiImgName'
}

export const emojiPath = (url) => {
  return require( `../themes/faces/${url}`)
}

/** 字符串标签转换 */
export const labelRep = (str: string, reversal?: boolean) => {
  if (!str) return ''
  // 反正回去
  if (reversal) {
    return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'")
  }
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

/*
** 任意长度随机字母数字组合
** min-长度
*/
export const getRandomWord = (min: number) => {
  // eslint-disable-next-line prefer-const
  let str = "", range = min, arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

/**
 * @文本转换批量图片替换方法
 * @strCont 消息字符串
 * @imgSize 表情图片的大小
 */
export const regContentImg = (strCont?: string, imgSize?: number) => {
  if (!strCont) return ''
  // 把字符串替换表情图片
  for (const i in emoji) {
    const reg= new RegExp("\\"+ i, "g")
    // 给当前替换的图片给一个位置的值，防止过滤匹配图片的时候出现问题
    strCont = strCont?.replace(reg, function () {
      const t = "emoji-" + getRandomWord(5)
      // 替换表情
      const strimg= `<img src="${emojiPath(emoji[i])}" width="${imgSize || 16}px" height="${imgSize || 16}px" ${emojiLabel.key}="${i}" data-key="${t}"/>`
      return strimg
    })
  }
  return strCont
}

/*
 * @Date: 2022-06-17 10:52:05
 * @Description: file content
 */
export const isObj = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

// 清除字符串所有的空格
export const clearSpace = (str) => {
  const newStr = str || ''
  return `${newStr}`.replace(/\s+/g, '')
}


// 获取guid
export const getGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8
    return v.toString(16)
  })
}

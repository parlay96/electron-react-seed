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

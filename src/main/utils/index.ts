/*
 * @Date: 2022-06-25 14:20:29
 * @Description: file content
 */
export * from "./shortcut-key"
export * from "./check-update"
export * from "./tray"
export * from "./menu"

// 生成参数
export const formatParams = (params) => {
  let paramStr = ''
  if (!params) return paramStr
  Object.keys(params)
    .forEach((item) => {
      if (paramStr === '') {
        paramStr = `${item}=${params[item]}`
      } else {
        paramStr = `${paramStr}&${item}=${params[item]}`
      }
    })
  return paramStr
}

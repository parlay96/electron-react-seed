/*
 * @Date: 2022-07-29 16:15:07
 * @Description: 校验方法
 */
/**
 * @name: isPhone for jsxin
 * @params: tel: string 当前需要验证的手机号
 * @return: boolean
 * @description: 验证传入的手机号是否为真
 */
export const isPhone = (tel: string | undefined): boolean => {
  if (!tel) {
    return false
  }
  const reg = /^1[3-9]\d{9}$/
  return reg.test(tel)
}

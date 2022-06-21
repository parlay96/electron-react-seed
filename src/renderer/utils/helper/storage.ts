/*
 * @Author: pl
 * @Date: 2022-05-31 15:31:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-20 10:22:37
 * @Description: file content
 * @FilePath: \yp-pc\src\utils\helper\storage.ts
 */
/**
 * Set storage
 *
 * @param name
 * @param content
 * @param maxAge
 */
export const setStore = (name: string, content: any) => {
  return localStorage.setItem(name, JSON.stringify(content))
}

/**
 * Get storage
 *
 * @param name
 * @returns {*}
 */
export const getStore = (name: string) => {
  const val = localStorage.getItem(name)
  if (val) {
    try {
      return JSON.parse(val)
    } catch (error) {
      localStorage.removeItem(name)
      return undefined
    }
  }
  return undefined
}

/**
 * Delete storage
 *
 * @param name
 */
export const deleteStore = (name: string) => {
  if (name) {
    return localStorage.removeItem(name)
  }
  return undefined
}

/**
 * Clear all storage
 */
export const clearAllStore = () => {
  localStorage.clear()
}

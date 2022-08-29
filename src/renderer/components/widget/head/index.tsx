/*
 * @Date: 2022-05-31 17:02:44
 * @Description: 头部导航
 */
import React, { memo } from 'react'
import WindowHead from './window'
import MacHead from './mac'

// 头部导航
const Head = memo(() => {
  const isMac = process.platform === 'darwin'
  return (
    isMac ? <MacHead /> : <WindowHead />
  )
})

export default Head

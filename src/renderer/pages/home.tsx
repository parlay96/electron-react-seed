/*
 * @Author: penglei
 * @Date: 2022-05-26 12:53:12
 * @LastEditors: penglei
 * @LastEditTime: 2022-05-26 13:22:45
 * @Description:
 */
import React, { useEffect } from "react"
import stylesCss from './index.module.scss'

interface ExampleDemoProps {
  data?: any[]
}

const Home = (props: ExampleDemoProps) => {
  const { data } = props

  useEffect(() => {
    console.log(12223)
  }, [])

  return (
    <>
      <div className={stylesCss.bos}>
        <webview style={{ width: '100%', height: '100%' }} src="https://www.yupao.com"></webview>
      </div>
    </>
  )
}

export default Home

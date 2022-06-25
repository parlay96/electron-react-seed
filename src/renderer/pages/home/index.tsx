/*
 * @Author: penglei
 * @Date: 2022-05-26 12:53:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-25 15:32:46
 * @Description:
 */
import React, { useEffect } from "react"
import stylesCss from './index.module.scss'

const Home = () => {
  return (
    <>
      <div className={stylesCss.bos}>
        {!process.env.IS_WEB && <webview style={{ width: '100%', height: '100%' }} src="http://192.168.0.17:3000"></webview>}
      </div>
    </>
  )
}

export default Home

/*
 * @Author: penglei
 * @Date: 2022-05-26 12:53:12
 * @LastEditors: pl
 * @LastEditTime: 2022-05-28 19:02:01
 * @Description:
 */
import React, { useEffect } from "react"
import stylesCss from './index.module.scss'
const RemotePcHome = React.lazy(() => import("pc/home"))

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
        <React.Suspense fallback="Loading Slides">
          <RemotePcHome />
        </React.Suspense>
        {/* <webview style={{ width: '100%', height: '100%' }} src="https://www.yupao.com"></webview> */}
      </div>
    </>
  )
}

export default Home

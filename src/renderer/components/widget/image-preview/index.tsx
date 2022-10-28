/*
 * @Date: 2022-08-15 14:29:53
 * @Description: 图片预览组件
 */

import React, { useState, useEffect } from 'react'
import { Image } from 'antd'
import { publicPublish, publicSubscribe } from '@/dep'

const ImagePreview: React.FC = () => {

  const [visible, setVisible] = useState(false)
  const [imageData, setImageData] = useState<string[]>([])

  useEffect(() => {
    publicSubscribe.listen({
      publisher: publicPublish,
      message: "pmage-preview",
      handler: (self, info) => {
        setVisible(true)
        setImageData(info)
      }
    })
    /** 卸載訂閲器 */
    return () => {
      publicPublish.removeListener(publicSubscribe, 'pmage-preview')
    }
  }, [])

  return (
    <>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
          {imageData?.map((item, index) =>
            <Image key={`preview-${index}`} src={item} />
          )}
        </Image.PreviewGroup>
      </div>
    </>
  )
}

export default ImagePreview

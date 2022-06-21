/*
 * @Date: 2022-05-30 10:55:45
 * @Description:
 */
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Head } from '@/components'
import styles from './index.module.scss'

export interface ILayoutProps {
}

export default function Layout (props: ILayoutProps) {
  return (
    <div className={styles.ypMain}>
      <Head />
      <div className={styles.ypContent}>
        {/* <Auth><Outlet /></Auth> */}
        <Outlet />
      </div>
    </div>
  )
}

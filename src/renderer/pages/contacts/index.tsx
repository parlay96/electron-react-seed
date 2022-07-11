/*
 * @Date: 2022-06-28 11:47:52
 * @Description: 通信录
 */
import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Icon, permissionDialog } from '@/components'
import { Organization, Personnel } from './components'
import styles from './index.module.scss'

const Contacts = () => {
  useEffect(() => {
    permissionDialog()
  })
  return (
    <div className={styles.contactsView}>
      <div className={styles.contactPersonBox}>
        <div className={styles.cpTitleBox}>
          <div className={styles.title}>
            <h2>通讯录</h2>
          </div>
        </div>
        <div className={styles.companyList}>
          <Organization />
        </div>
      </div>
      <div className={styles.personnelList}>
        <Personnel />
      </div>
    </div>
  )
}

export default Contacts

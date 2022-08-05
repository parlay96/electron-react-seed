/*
 * @Date: 2022-07-21 14:11:26
 * @Description: file content
 */
// 过滤通信录
export const cleanList = (data) => {
  if (!data) return []
  return data?.map(item => {
    const admin_level = item?.permission ? 1 : 0
    // portraitName的简写模式，一把用来做头像
    const nameText = item?.title?.length > 2 ? item?.title?.substring(item?.title?.length - 2) : item.title
    const order: any = {
      name: item.title,
      avatar: item.avatar,
      cid: item.cid,
      contacts_id: item.contacts_id,
      admin_level,
      portraitName: nameText,
      children: [
        {
          name: '组织架构',
          layer: 1,
          key: item.contacts_id,
          cid: item.cid,
          contacts_id: item.contacts_id,
          children: item?.children?.map(citem => {
            return {
              name: citem.title,
              layer: 2,
              key: citem.contacts_id,
              cid: citem.cid,
              contacts_id: citem.contacts_id,
              people_number: citem.people_number
            }
          })
        },
      ]
    }
    // 有权限访问时候
    if (admin_level !== 0) {
      order.children.push({
        name: '角色',
        type: 'user',
        layer: 1,
        key: 'juese',
        cid: item.cid,
        contacts_id: item.contacts_id
      })
    }
    return order
  })
}

// 过滤子级部门人员
export const cleanSonList = (data) => {
  if (!data) return null
  const order = {navigations: [], data: []}
  order.navigations = data?.navigations
  // 部门数据
  data.contacts_list?.forEach(item => {
    order.data.push({
      avatar: item.avatar,
      name: item.title,
      layer: 1,
      key: item.contacts_id,
      contacts_id: item.contacts_id,
      people_number: item.people_number
    })
  })
  // 人员数据
  data.contacts_user?.forEach(item => {
    // portraitName的简写模式，一把用来做头像
    const nameText = item?.user_name?.length > 2 ? item?.user_name?.substring(item?.user_name?.length - 2) : item.user_name
    order.data.push({
      type: 'user',
      avatar: item.avatar,
      name: item.user_name,
      layer: 1,
      key: item.uid,
      portraitName: nameText,
      contacts_id: item.contacts_id,
    })
  })
  return order
}

// 根据企业id, 获取企业信息
export const getEnterpriseInfo = (cid, data) => {
  let order = {
    info: {},
    departmentIds: [],
    initSelectedKey: ''
  }
  // 根据cid，获取当前企业信息。
  if (data && data.length) {
    const info = data?.find(item => item.cid == cid)
    // 获取当前企业下，自己的部门id集合, 如果存在部门
    if (info && info?.children?.[0] && info?.children[0]?.children) {
      // 当前用户在企业下面的部门ids
      const departmentIds = info?.children[0]?.children?.map(item => item.contacts_id)
      // 默认选中第一个部门
      const initSelectedKey = departmentIds[0]
      order = {
        info,
        departmentIds,
        initSelectedKey
      }
      // 不存在部门
    } else {
      order.info = info
      order.initSelectedKey = info.contacts_id
    }
  }
  return order
}

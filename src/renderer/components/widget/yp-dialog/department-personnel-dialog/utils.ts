/*
 * @Date: 2022-07-26 11:12:33
 * @Description: file content
 */

export type ISelected = {
   avatar: string, contacts_id: string,  name: string,
   type: string, uid?: string, portraitName?: string, departments?: string[], departmentPaths?: string[]
}

/*
* 过滤子级部门人员
*/
export const cleanSonList = (data, type: 'users' | 'departments') => {
  if (!data) return null
  const order = {navigations: [], data: []}
  order.navigations = data?.navigations
  // 部门的路径
  const departmentPaths = data?.navigations?.map(item => item.title)
  // 部门数据
  data.contacts_list?.forEach(item => {
    order.data.push({
      type: 'departments',
      name: item.title,
      layer: 1,
      key: item.contacts_id,
      contacts_id: item.contacts_id,
      showCheckbox: type == 'departments', // 只有是type为部门时才显示选择框
      people_number: item.people_number,
      departmentPaths: [...departmentPaths, item.title]
    })
  })
  // 人员数据
  if (type == 'users') {
    data.contacts_user?.forEach(item => {
      // portraitName的简写模式，一把用来做头像
      const nameText = item?.user_name?.length > 2 ? item?.user_name?.substring(item?.user_name?.length - 2) : item.user_name
      // 当前人员所在的部门集合
      const departments = item?.contacts_list?.map(item => item.title)
      order.data.push({
        type: 'users',
        name: item.user_name,
        portraitName: nameText,
        layer: 1,
        key: item.uid,
        uid: item.uid, // 用户ID
        contacts_id: item.contacts_id, // 部门ID
        showCheckbox: type == 'users', // 只有是type为人员时才显示选择框
        avatar: item.avatar,
        departments: departments || []
      })
    })
  }

  return order
}

/*
* 查询当前节点是否选择了
*/
export const queryChecked = (item, selectedData: ISelected[]) => {
  // 需要匹配的id，如果是人员，那就匹配 uid 部门就匹配contacts_id
  const Key = item.type == 'users' ? 'uid' : 'contacts_id'
  // 查询当前节点是否选择了
  return selectedData?.some(sitem => sitem[Key] == item[Key])
}

/*
* 处理点击选择的逻辑
* @item 当前的选择项
* @selectedData 已选择的
* @poprs 配置项
*/
export const handleSelect = (selectedItem, selectedData: ISelected[], poprs): Promise<ISelected[] | boolean> => {
  return new Promise((resolve,reject) => {
    const { multiple, max: _max } = poprs
    // 需要匹配的id，如果是人员，那就匹配 uid 部门就匹配contacts_id
    const Key = selectedItem.type == 'users' ? 'uid' : 'contacts_id'
    // 如果当前点击的是用户，那么需要添加uid进来
    const otherObj = selectedItem.type == 'users' ? {
      uid: selectedItem.uid,
      portraitName: selectedItem.portraitName,
      departments: selectedItem.departments
    } : { departmentPaths: selectedItem.departmentPaths }
    // 组成选中的数据
    const resultObj = {
      avatar: selectedItem.avatar,
      contacts_id: selectedItem.contacts_id,
      name: selectedItem.name,
      type: selectedItem.type,
      ...otherObj,
    }
    // 如果已经选择了，就取消选择
    if (queryChecked(selectedItem, selectedData)) {
      // 移除当前点击项
      return resolve(selectedData.filter(item => item[Key] !== selectedItem[Key]))
    }
    // 单选的情况
    if (!multiple) resolve([resultObj])
    // 多选的情况 (超出了选择数量)
    if (selectedData.length + 1 > _max) {
      reject(false)
    }
    resolve([
      ...selectedData,
      resultObj
    ])
  })
}

/*
 * @Date: 2022-10-25 18:41:00
 * @Description: file content
 */
export type ItemType = {url: string, name: string, title: string, width: number, height: number}

export interface IEditInputRef {
  /**
   * @添加表情方法
   */
  chooseEmoji: (item: ItemType) => Promise<any>
  /**
   * @获取输入框值
   */
  getValue: () => Promise<string | null>
  /**
   * @清空输入框值
   */
  clear: () => Promise<any>
  /**
   * @获取焦点
   */
  focus: () => Promise<any>
  /**
   * @设置提示文本
   */
  setPlaceholder: (placeholder: string) => Promise<any>
  /**
   * @设置输入框值
   */
  setValue: (val: string) => Promise<any>
}

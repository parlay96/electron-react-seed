/*
 * @Date: 2022-06-20 10:11:03
 * @Description: file content
 */

// 壳子头部组件（基础组件）
export { default as Head } from './head'

// 左侧菜单（基础组件）
export { default as Menu } from './menu'

// 弹窗蒙层，基于它可以写出自己想要得弹窗。dialog是基于它固定了的某种弹窗。这个mask只给了弹窗壳子的动画，内容是一个空白。
// 这也是最基本的弹窗。使用最多的弹窗, 不带有任何东西，一切内容自定义
export { default as Mask } from './dialog/mask'

// 对话框组件， 与 fast-dialog的区别是： fast-dialog是使用方法直接调用了这个组件，封装了它
// 带有自定义的弹窗，比如有标题等等。
export { default as Dialog } from './dialog'

// 获取验证码
export { default as VerificationCode } from './verification-code'

// 个人中心悬浮框
export { default as PersonalCenter } from './personal-center-dialog'

// 个人设置悬浮框
export { default as personalSettingsDialog } from './personal-settings-dialog'

// 图片预览
export { default as ImagePreview } from './image-preview'

// 添加成员抽屉
export { default as AddMemberDrawer } from './add-member-drawer'

// 成员申请抽屉
export { default as MembershipDrawer } from './member-application-drawer'

// 系统升级弹窗
export { default as VersionUpdateDialog } from './version-update-dialog'

// 快速调用类型的弹窗，直接用方法调用，封装了dialog 使用方法直接调用，不需要页面写上组件了！
export * from './fast-dialog'

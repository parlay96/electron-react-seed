/*
 * @Date: 2022-05-29 10:24:10
 * @Description: 全局配置类
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const { reducer, actions, name } = createSlice({
  name: 'config',
  initialState: {
    // 窗口最大化
    isMaximize: false,
  },
  reducers: {
    setState (state, { payload }: PayloadAction<Record<string, any>>) {
      Object.assign(state, payload)
    },
    setMaximize (state, { payload }: PayloadAction<boolean>) {
      state.isMaximize = payload
    },
  },
})

export const configName = name
export const configReducer = reducer
export const configActions = { ...actions }

/*
 * @Date: 2022-05-29 10:23:11
 * @Description:
 */
import { exampleActions, exampleReducer, exampleName } from './example'
import { userActions, userReducer, userName } from './modules/user'
import { configActions, configReducer, configName } from './modules/global/config'

export const reducer = {
  [exampleName]: exampleReducer,
  [userName]: userReducer,
  [configName]: configReducer,
}

export const actions = {
  exampleActions,
  userActions,
  configActions,
}

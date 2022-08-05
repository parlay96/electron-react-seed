/*
 * @Date: 2022-07-27 17:06:04
 * @Description:
 */
import { useContext } from "react"
import { AuthContext } from "./context"
export function useAuth () {
  return useContext(AuthContext)
}

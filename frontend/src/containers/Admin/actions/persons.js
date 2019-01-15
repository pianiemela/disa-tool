import * as types from '../../../redux/action_types'
import { getUsers, changeGlobalRole } from '../../../api/persons'
import apiPromise from '../../../utils/apiPromise'

export const adminGetUsers = data => apiPromise(getUsers, data, {
  success: { type: types.ADMIN_GET_USERS }
})

export const adminChangeGlobalRole = data => apiPromise(changeGlobalRole, data, {
  success: { type: types.ADMIN_CHANGE_ROLE }
})


import { getUsers, changeGlobalRole } from '../../../api/persons'
import apiPromise from '../../../utils/apiPromise'

export const adminGetUsers = data => apiPromise(getUsers, data, {
  success: { type: 'ADMIN_GET_USERS' }
})

export const adminChangeGlobalRole = data => apiPromise(changeGlobalRole, data, {
  success: { type: 'ADMIN_CHANGE_ROLE' }
})


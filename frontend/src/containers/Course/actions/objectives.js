import { create, remove, edit } from '../../../api/objectives'
import apiPromise from '../../../utils/apiPromise'

export const addObjective = data => apiPromise(create, data, {
  success: { type: 'OBJECTIVE_CREATE' }
})

export const removeObjective = data => apiPromise(remove, data, {
  success: { type: 'OBJECTIVE_DELETE' }
})

export const editObjective = data => apiPromise(edit, data, {
  success: { type: 'OBJECTIVE_EDIT' }
})

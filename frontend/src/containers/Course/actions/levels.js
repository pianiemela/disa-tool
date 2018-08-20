import { create, remove, edit } from '../../../api/skillLevels'
import apiPromise from '../../../utils/apiPromise'

export const addLevel = data => apiPromise(create, data, {
  success: { type: 'LEVEL_CREATE' }
})

export const removeLevel = data => apiPromise(remove, data, {
  success: { type: 'LEVEL_DELETE' }
})

export const editLevel = data => apiPromise(edit, data, {
  success: { type: 'LEVEL_EDIT' }
})

import { create, remove } from '../../../api/skillLevels'
import apiPromise from '../../../utils/apiPromise'

export const addLevel = data => apiPromise(create, data, {
  success: { type: 'LEVEL_CREATE' }
})

export const removeLevel = data => apiPromise(remove, data, {
  success: { type: 'LEVEL_DELETE' }
})

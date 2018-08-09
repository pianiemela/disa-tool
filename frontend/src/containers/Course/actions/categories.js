import { create, remove } from '../../../api/categories'
import apiPromise from '../../../utils/apiPromise'

export const addCategory = data => apiPromise(create, data, {
  success: { type: 'CATEGORY_CREATE' }
})

export const removeCategory = data => apiPromise(remove, data, {
  success: { type: 'CATEGORY_DELETE' }
})

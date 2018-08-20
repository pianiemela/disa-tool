import { create, remove, edit } from '../../../api/categories'
import apiPromise from '../../../utils/apiPromise'

export const addCategory = data => apiPromise(create, data, {
  success: { type: 'CATEGORY_CREATE' }
})

export const removeCategory = data => apiPromise(remove, data, {
  success: { type: 'CATEGORY_DELETE' }
})

export const editCategory = data => apiPromise(edit, data, {
  success: { type: 'CATEGORY_EDIT' }
})

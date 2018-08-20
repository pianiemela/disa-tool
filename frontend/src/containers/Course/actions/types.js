import { create, remove, headerCreate, headerRemove, edit, headerEdit } from '../../../api/types'
import apiPromise from '../../../utils/apiPromise'

export const addType = data => apiPromise(create, data, {
  success: { type: 'TYPE_CREATE' }
})

export const removeType = data => apiPromise(remove, data, {
  success: { type: 'TYPE_DELETE' }
})

export const addHeader = data => apiPromise(headerCreate, data, {
  success: { type: 'TYPE_HEADER_CREATE' }
})

export const removeHeader = data => apiPromise(headerRemove, data, {
  success: { type: 'TYPE_HEADER_DELETE' }
})

export const editType = data => apiPromise(edit, data, {
  success: { type: 'TYPE_EDIT' }
})

export const editHeader = data => apiPromise(headerEdit, data, {
  success: { type: 'TYPE_HEADER_EDIT' }
})

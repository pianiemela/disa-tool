import * as types from '../../../redux/action_types'
import { create, remove, headerCreate, headerRemove, edit, headerEdit } from '../../../api/types'
import apiPromise from '../../../utils/apiPromise'

export const addType = data => apiPromise(create, data, {
  success: { type: types.TYPE_CREATE }
})

export const removeType = data => apiPromise(remove, data, {
  success: { type: types.TYPE_DELETE }
})

export const addHeader = data => apiPromise(headerCreate, data, {
  success: { type: types.TYPE_HEADER_CREATE }
})

export const removeHeader = data => apiPromise(headerRemove, data, {
  success: { type: types.TYPE_HEADER_DELETE }
})

export const editType = data => apiPromise(edit, data, {
  success: { type: types.TYPE_EDIT }
})

export const editHeader = data => apiPromise(headerEdit, data, {
  success: { type: types.TYPE_HEADER_EDIT }
})

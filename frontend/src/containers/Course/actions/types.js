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

export const moveType = dispatch => typeHeaderId => (drag, hover) => {
  edit({ id: drag.id, order: hover.order })
  edit({ id: hover.id, order: drag.order })
  dispatch({
    type: 'TYPE_MOVE',
    drag,
    hover,
    type_header_id: typeHeaderId
  })
}

export const moveHeader = dispatch => (drag, hover) => {
  headerEdit({ id: drag.id, order: hover.order })
  headerEdit({ id: hover.id, order: drag.order })
  dispatch({
    type: 'TYPE_HEADER_MOVE',
    drag,
    hover
  })
}

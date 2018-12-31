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

export const moveCategory = dispatch => (drag, hover) => {
  edit({ id: drag.id, order: hover.order })
  edit({ id: hover.id, order: drag.order })
  dispatch({
    type: 'CATEGORY_MOVE',
    drag,
    hover
  })
}

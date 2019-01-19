import * as types from '../../../redux/action_types'
import { create, remove, edit } from '../../../api/categories'
import apiPromise from '../../../utils/apiPromise'

export const addCategory = data => apiPromise(create, data, {
  success: { type: types.CATEGORY_CREATE }
})

export const removeCategory = data => apiPromise(remove, data, {
  success: { type: types.CATEGORY_DELETE }
})

export const editCategory = data => apiPromise(edit, data, {
  success: { type: types.CATEGORY_EDIT }
})

export const moveCategory = dispatch => (drag, hover) => {
  edit({ id: drag.id, order: hover.order })
  edit({ id: hover.id, order: drag.order })
  dispatch({
    type: types.CATEGORY_MOVE,
    drag,
    hover
  })
}

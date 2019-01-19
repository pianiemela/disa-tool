import * as types from '../../../redux/action_types'
import { create, remove, edit } from '../../../api/objectives'
import apiPromise from '../../../utils/apiPromise'

export const addObjective = data => apiPromise(create, data, {
  success: { type: types.OBJECTIVE_CREATE }
})

export const removeObjective = data => apiPromise(remove, data, {
  success: { type: types.OBJECTIVE_DELETE }
})

export const editObjective = data => apiPromise(edit, data, {
  success: { type: types.OBJECTIVE_EDIT }
})

export const changeCell = data => apiPromise(edit, data.call, {
  success: { type: types.OBJECTIVE_CHANGE_CELL, local: data.local }
})

export const moveObjective = dispatch => (drag, hover) => {
  edit({ id: drag.id, order: hover.order })
  if (hover.id) {
    edit({ id: hover.id, order: drag.order })
  }
  dispatch({
    type: types.OBJECTIVE_MOVE,
    drag,
    hover
  })
}

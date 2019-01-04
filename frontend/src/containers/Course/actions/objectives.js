import { create, remove, edit } from '../../../api/objectives'
import apiPromise from '../../../utils/apiPromise'

export const addObjective = data => apiPromise(create, data, {
  success: { type: 'OBJECTIVE_CREATE' }
})

export const removeObjective = data => apiPromise(remove, data, {
  success: { type: 'OBJECTIVE_DELETE' }
})

export const editObjective = data => apiPromise(edit, data, {
  success: { type: 'OBJECTIVE_EDIT' }
})

export const changeCell = data => apiPromise(edit, data.call, {
  success: { type: 'OBJECTIVE_CHANGE_CELL', local: data.local }
})

export const moveObjective = dispatch => (drag, hover) => {
  edit({ id: drag.id, order: hover.order })
  if (hover.id) {
    edit({ id: hover.id, order: drag.order })
  }
  dispatch({
    type: 'OBJECTIVE_MOVE',
    drag,
    hover
  })
}

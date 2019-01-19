import * as types from '../../../redux/action_types'
import { create, remove, edit } from '../../../api/skillLevels'
import apiPromise from '../../../utils/apiPromise'

export const addLevel = data => apiPromise(create, data, {
  success: { type: types.LEVEL_CREATE }
})

export const removeLevel = data => apiPromise(remove, data, {
  success: { type: types.LEVEL_DELETE }
})

export const editLevel = data => apiPromise(edit, data, {
  success: { type: types.LEVEL_EDIT }
})

export const moveLevel = dispatch => (drag, hover) => {
  edit({ id: drag.id, order: hover.order })
  edit({ id: hover.id, order: drag.order })
  dispatch({
    type: types.LEVEL_MOVE,
    drag,
    hover
  })
}

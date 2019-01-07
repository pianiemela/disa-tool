import { create, remove, edit } from '../../../api/skillLevels'
import apiPromise from '../../../utils/apiPromise'

export const addLevel = data => apiPromise(create, data, {
  success: { type: 'LEVEL_CREATE' }
})

export const removeLevel = data => apiPromise(remove, data, {
  success: { type: 'LEVEL_DELETE' }
})

export const editLevel = data => apiPromise(edit, data, {
  success: { type: 'LEVEL_EDIT' }
})

export const moveLevel = dispatch => (drag, hover) => {
  edit({ id: drag.id, order: hover.order })
  edit({ id: hover.id, order: drag.order })
  dispatch({
    type: 'LEVEL_MOVE',
    drag,
    hover
  })
}

import * as types from '../../../redux/action_types'
import { addObjective, removeObjective, addType, removeType, create, remove, edit, editObjectives } from '../../../api/tasks'
import apiPromise from '../../../utils/apiPromise'

export const addObjectiveToTask = data => apiPromise(addObjective, data, {
  success: { type: types.TASK_ATTACH_OBJECTIVE }
})

export const removeObjectiveFromTask = data => apiPromise(removeObjective, data, {
  success: { type: types.TASK_DETACH_OBJECTIVE }
})

export const addTypeToTask = data => apiPromise(addType, data, {
  success: { type: types.TASK_ATTACH_TYPE }
})

export const removeTypeFromTask = data => apiPromise(removeType, data, {
  success: { type: types.TASK_DETACH_TYPE }
})

export const addTask = data => apiPromise(create, data, {
  success: { type: types.TASK_CREATE }
})

export const removeTask = data => apiPromise(remove, data, {
  success: { type: types.TASK_DELETE }
})

export const changeActive = id => (dispatch) => {
  dispatch({
    type: types.TASK_CHANGE_ACTIVE,
    id
  })
}

export const editTask = data => apiPromise(edit, data, {
  success: { type: types.TASK_EDIT }
})

export const editTaskObjectives = data => apiPromise(editObjectives, data, {
  success: { type: types.TASK_EDIT_OBJECTIVE_MULTIPLIERS }
})

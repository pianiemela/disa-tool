import { addObjective, removeObjective, addType, removeType, create, remove } from '../../../api/tasks'
import apiPromise from '../../../utils/apiPromise'

export const addObjectiveToTask = data => apiPromise(addObjective, data, {
  success: { type: 'TASK_ATTACH_OBJECTIVE' }
})

export const removeObjectiveFromTask = data => apiPromise(removeObjective, data, {
  success: { type: 'TASK_DETACH_OBJECTIVE' }
})

export const addTypeToTask = data => apiPromise(addType, data, {
  success: { type: 'TASK_ATTACH_TYPE' }
})

export const removeTypeFromTask = data => apiPromise(removeType, data, {
  success: { type: 'TASK_DETACH_TYPE' }
})

export const addTask = data => apiPromise(create, data, {
  success: { type: 'TASK_CREATE' }
})

export const removeTask = data => apiPromise(remove, data, {
  success: { type: 'TASK_DELETE' }
})

export const changeActive = dispatch => (id) => {
  dispatch({
    type: 'TASK_CHANGE_ACTIVE',
    id
  })
}

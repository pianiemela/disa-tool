import { addObjective, removeObjective, addType, removeType, create, remove } from '../../../api/tasks'

export const addObjectiveToTask = data => new Promise((resolve) => {
  addObjective(data).then(response => resolve({
    type: 'TASK_ATTACH_OBJECTIVE',
    response: response.data
  }))
})

export const removeObjectiveFromTask = data => new Promise((resolve) => {
  removeObjective(data).then(response => resolve({
    type: 'TASK_DETACH_OBJECTIVE',
    response: response.data
  }))
})

export const addTypeToTask = data => new Promise((resolve) => {
  addType(data).then(response => resolve({
    type: 'TASK_ATTACH_TYPE',
    response: response.data
  }))
})

export const removeTypeFromTask = data => new Promise((resolve) => {
  removeType(data).then(response => resolve({
    type: 'TASK_DETACH_TYPE',
    response: response.data
  }))
})

export const addTask = data => new Promise((resolve) => {
  create(data).then(response => resolve({
    type: 'TASK_CREATE',
    response: response.data
  }))
})

export const removeTask = data => new Promise((resolve) => {
  remove(data).then(response => resolve({
    type: 'TASK_DELETE',
    response: response.data
  }))
})

export const changeActive = dispatch => (id) => {
  dispatch({
    type: 'TASK_CHANGE_ACTIVE',
    id
  })
}

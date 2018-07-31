import { postJson, deleteCall } from '../../../utils/utils'

export const addObjectiveToTask = data => new Promise((resolve) => {
  postJson('/tasks/objectives/attach', data).then(response => resolve({
    type: 'TASK_ATTACH_OBJECTIVE',
    response: response.data
  }))
})

export const removeObjectiveFromTask = data => new Promise((resolve) => {
  postJson('/tasks/objectives/detach', data).then(response => resolve({
    type: 'TASK_DETACH_OBJECTIVE',
    response: response.data
  }))
})

export const addTypeToTask = data => new Promise((resolve) => {
  postJson('/tasks/types/attach', data).then(response => resolve({
    type: 'TASK_ATTACH_TYPE',
    response: response.data
  }))
})

export const removeTypeFromTask = data => new Promise((resolve) => {
  postJson('/tasks/types/detach', data).then(response => resolve({
    type: 'TASK_DETACH_TYPE',
    response: response.data
  }))
})

export const addTask = data => new Promise((resolve) => {
  postJson('/tasks/create', data).then(response => resolve({
    type: 'TASK_CREATE',
    response: response.data
  }))
})

export const removeTask = data => new Promise((resolve) => {
  deleteCall(`/tasks/${data.id}`).then(response => resolve({
    type: 'TASK_DELETE',
    response: response.data
  }))
})

export const addTypeToTask = (data) => {
  const response = {
    message: '<addTypeToTaskSuccess>',
    data
  }
  const action = {
    type: 'TASK_ADD_TYPE',
    response
  }
  return new Promise((resolve) => {
    setTimeout(resolve, 100, action)
  })
}

export const removeTypeFromTask = (data) => {
  const response = {
    message: '<removeTypeFromTaskSuccess>',
    data: {
      taskId: data.taskId,
      typeId: data.typeId
    }
  }
  const action = {
    type: 'TASK_REMOVE_TYPE',
    response
  }
  return new Promise((resolve) => {
    setTimeout(resolve, 100, action)
  })
}

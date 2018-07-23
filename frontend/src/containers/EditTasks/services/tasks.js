import { postJson, deleteCall } from '../../../utils/utils'

export const addObjectiveToTask = data => new Promise((resolve) => {
  const response = {
    message: '<addObjectiveToTaskSuccess>',
    data
  }
  const action = {
    type: 'TASK_ADD_OBJECTIVE',
    response
  }
  setTimeout(resolve, 100, action)
})

export const removeObjectiveFromTask = data => new Promise((resolve) => {
  const response = {
    message: '<removeObjectiveFromTaskSuccess>',
    data
  }
  const action = {
    type: 'TASK_REMOVE_OBJECTIVE',
    response
  }
  setTimeout(resolve, 100, action)
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

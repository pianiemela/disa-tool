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

export const addTask = (data) => {
  const response = {
    message: '<addTaskSuccess>',
    data: {
      id: 2,
      name: data.name
    }
  }
  const action = {
    type: 'TASK_CREATE',
    response
  }
  return new Promise((resolve) => {
    setTimeout(resolve, 100, action)
  })
}
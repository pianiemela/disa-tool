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
      ...data,
      id: 2
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

export const removeTask = (data) => {
  const response = {
    message: '<removeTaskSuccess>',
    data: {
      id: data.id
    }
  }
  const action = {
    type: 'TASK_DELETE',
    response
  }
  return new Promise((resolve) => {
    setTimeout(resolve, 100, action)
  })
}

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

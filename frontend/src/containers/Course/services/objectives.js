export const addObjective = (data) => {
  const response = {
    message: '<addCObjectiveSuccess>',
    data: {
      ...data,
      id: 15
    }
  }
  const action = {
    type: 'OBJECTIVE_CREATE',
    response
  }
  return new Promise((resolve) => {
    setTimeout(resolve, 100, action)
  })
}

export const removeObjective = (data) => {
  const response = {
    message: '<removeObjectiveSuccess>',
    data: {
      id: data.id
    }
  }
  const action = {
    type: 'OBJECTIVE_DELETE',
    response
  }
  return new Promise((resolve) => {
    setTimeout(resolve, 100, action)
  })
}

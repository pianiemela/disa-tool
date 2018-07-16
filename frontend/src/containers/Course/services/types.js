export const removeType = (data) => {
  const response = {
    message: '<removeTypeSuccess>',
    data: {
      id: data.id
    }
  }
  const action = {
    type: 'TYPE_DELETE',
    response
  }
  return new Promise((resolve) => {
    setTimeout(resolve, 100, action)
  })
}

export const addType = (data) => {
  const response = {
    message: '<addTypeSuccess>',
    data: {
      ...data,
      id: 10
    }
  }
  const action = {
    type: 'TYPE_CREATE',
    response
  }
  return new Promise((resolve) => {
    setTimeout(resolve, 100, action)
  })
}

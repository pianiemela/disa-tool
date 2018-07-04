export const removeType = data => {
  const response = {
    message: '<removeTypeSuccess>',
    data: {
      id: data.typeId
    }
  }
  const action = {
    type: 'TYPE_REMOVE',
    response
  }
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 100, action)
  })
}

export const addType = data => {
  const response = {
    message: '<addTypeSuccess>',
    data: {
      id: 10,
      name: data.name,
      courseId: data.courseId
    }
  }
  const action = {
    type: 'TYPE_ADD_NEW',
    response
  }
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 100, action)
  })
}
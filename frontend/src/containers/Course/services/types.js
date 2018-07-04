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
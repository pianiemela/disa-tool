export const addCategory = data => {
  const response = {
    message: '<addCategorySuccess>',
    data: {
      id: 15,
      name: data.name
    }
  }
  const action = {
    type: 'CATEGORY_CREATE',
    response
  }
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 100, action)
  })
}
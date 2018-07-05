const addObjective = (data) => {
  const response = {
    message: '<addCObjectiveSuccess>',
    data: {
      id: 15,
      name: data.name
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

module.exports = {
  addObjective
}

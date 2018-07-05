const addObjectiveToTask = data => new Promise((resolve) => {
  const response = {
    message: '<addObjectiveToTaskSuccess>',
    data
  }
  setTimeout(resolve, 100, response)
})

module.exports = {
  addObjectiveToTask
}

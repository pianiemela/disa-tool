export const addObjectiveToTask = data => new Promise((resolve, reject) => {
  const response = {
    message: '<addObjectiveToTaskSuccess>',
    data
  }
  setTimeout(resolve, 100, response)
})
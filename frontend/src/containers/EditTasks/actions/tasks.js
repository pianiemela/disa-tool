const changeTaskObjectiveMultiplier = dispatch => (data) => {
  dispatch({
    type: 'TASK_CHANGE_OBJECTIVE_MULTIPLIER',
    data
  })
}

module.exports = {
  changeTaskObjectiveMultiplier
}

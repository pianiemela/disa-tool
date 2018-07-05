export const changeTaskObjectiveMultiplier = dispatch => {
  return data => {
    dispatch({
      type: 'TASK_CHANGE_OBJECTIVE_MULTIPLIER',
      data
    })
  }
}
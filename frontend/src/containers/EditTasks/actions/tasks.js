export const changeTaskObjectiveMultiplier = dispatch => (data) => {
  dispatch({
    type: 'TASK_CHANGE_OBJECTIVE_MULTIPLIER',
    data
  })
}

export const changeActive = dispatch => (id) => {
  dispatch({
    type: 'TASK_CHANGE_ACTIVE',
    id
  })
}

export const changeTypeMultiplier = dispatch => {
  return data => {
    dispatch({
      type: 'TYPE_CHANGE_MULTIPLIER',
      data
    })
  }
}
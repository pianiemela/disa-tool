const changeTypeMultiplier = dispatch => (data) => {
  dispatch({
    type: 'TYPE_CHANGE_MULTIPLIER',
    data
  })
}

module.exports = {
  changeTypeMultiplier
}

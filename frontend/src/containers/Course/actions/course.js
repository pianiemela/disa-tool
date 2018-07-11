const setEditing = dispatch => (data) => {
  dispatch({
    type: 'COURSE_SET_EDITING',
    data
  })
}

module.exports = {
  setEditing
}

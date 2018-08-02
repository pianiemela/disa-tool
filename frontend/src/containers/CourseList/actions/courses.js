export const selectCourse = dispatch => id => dispatch({ // eslint-disable-line
  type: 'COURSELIST_COURSE_SELECT',
  id
})

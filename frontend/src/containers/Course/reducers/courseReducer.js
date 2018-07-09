const INITIAL_STATE = {
  editing: false,
  course: {}
}

const courseReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSE_GET_DATA':
      return {
        ...state,
        course: action.response.data.course
      }
    case 'COURSE_SET_EDITING':
      return {
        ...state,
        editing: action.data.value
      }
    default:
      return state
  }
}

export default courseReducer

const INITIAL_STATE = {
  editing: false,
  course: {},
  loading: true
}

const courseReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSE_GET_DATA':
      return {
        ...state,
        course: action.response.data.course,
        loading: false
      }
    case 'COURSE_GET_MATRIX':
      return {
        ...state,
        course: action.response.data.course,
        loading: false
      }
    case 'COURSE_RESET':
      return INITIAL_STATE
    default:
      return state
  }
}

export default courseReducer

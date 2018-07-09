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

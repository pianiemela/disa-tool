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
    default:
      return state
  }
}

export default courseReducer

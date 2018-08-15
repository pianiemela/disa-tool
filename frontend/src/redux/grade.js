const INITIAL_STATE = {
  grades: [],
  loading: true
}

const gradeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GRADE_GET_MANY':
      return {
        ...state,
        grades: action.response.data.grades,
        loading: false
      }
    case 'COURSE_RESET':
      return INITIAL_STATE
    default:
      return state
  }
}

export default gradeReducer

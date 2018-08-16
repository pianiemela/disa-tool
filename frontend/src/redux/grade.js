const INITIAL_STATE = {
  grades: [],
  loading: true
}

const gradeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GRADE_GET_MANY':
      return {
        ...state,
        grades: action.response.data,
        loading: false
      }
    case 'COURSE_RESET':
      return INITIAL_STATE
    case 'GRADE_CREATE':
      return {
        ...state,
        grades: [...state.grades, action.response.created]
      }
    default:
      return state
  }
}

export default gradeReducer

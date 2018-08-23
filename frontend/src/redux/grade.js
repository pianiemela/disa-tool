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
    case 'GRADE_DELETE':
      return {
        ...state,
        grades: state.grades.filter(grade => grade.id !== action.response.deleted.id)
      }
    case 'GRADE_EDIT':
      return {
        ...state,
        grades: state.grades.map(grade => (
          grade.id === action.response.edited.id ? action.response.edited : grade
        ))
      }
    case 'GRADE_UPDATE_CATEGORY_GRADES_SUCCESS': {
      const { updatedCategoryGrades } = action.payload
      const grades = state.grades.map((grade) => {
        const updatedValues = grade.category_grades.map(cg => (
          updatedCategoryGrades.find(u => u.id === cg.id) || cg
        ))
        return { ...grade, category_grades: updatedValues }
      })
      return { ...state, grades }
    }

    default:
      return state
  }
}

export default gradeReducer

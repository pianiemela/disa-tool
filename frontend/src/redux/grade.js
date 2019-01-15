import * as types from './action_types'

const INITIAL_STATE = {
  grades: [],
  loading: true
}

const gradeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GRADE_GET_MANY:
      return {
        ...state,
        grades: action.response.data,
        loading: false
      }
    case types.COURSE_RESET:
      return INITIAL_STATE
    case types.GRADE_CREATE:
      return {
        ...state,
        grades: [...state.grades, action.response.created]
      }
    case types.GRADE_DELETE:
      return {
        ...state,
        grades: state.grades.filter(grade => grade.id !== action.response.deleted.id)
      }
    case types.GRADE_EDIT:
      return {
        ...state,
        grades: state.grades.map(grade => (
          grade.id === action.response.edited.id ? ({
            ...grade,
            ...action.response.edited
          }) : grade
        ))
      }
    case types.GRADE_UPDATE_CATEGORY_GRADES_SUCCESS: {
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

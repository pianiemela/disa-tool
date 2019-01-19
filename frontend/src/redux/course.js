import * as types from './action_types'

const INITIAL_STATE = {
  editing: false,
  course: {},
  loading: true
}

const courseReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.COURSE_GET_DATA:
      return {
        ...state,
        course: action.response.data.course,
        loading: false
      }
    case types.COURSE_GET_MATRIX:
      return {
        ...state,
        course: action.response.data.course,
        loading: false
      }
    case types.COURSE_RESET:
      return INITIAL_STATE
    default:
      return state
  }
}

export default courseReducer

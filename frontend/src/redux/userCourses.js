import * as types from './action_types'

const INITIAL_STATE = []

export const userCoursesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.USER_GET_COURSES_SUCCESS:
      return action.payload
    default:
      return state
  }
}

export default userCoursesReducer

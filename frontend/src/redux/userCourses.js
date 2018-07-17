const INITIAL_STATE = []

export const userCoursesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'USER_GET_COURSES_SUCCESS':
      return action.payload
    default:
      return state
  }
}

export default userCoursesReducer

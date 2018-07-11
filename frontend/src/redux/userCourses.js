const INITIAL_STATE = []

export const userCoursesReducer = (state = INITIAL_STATE, action) => {
  console.log(action)
  switch (action.type) {
    case 'GET_USER_COURSES_SUCCESS':
      console.log('wuwut')
      return state
    default:
      return state
  }
}

export default userCoursesReducer

const INITIAL_STATE = {
  instances: [],
  courses: []
}

const listCoursesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSELIST_GET_COURSES':
      return {
        ...state,
        courses: action.response
      }
    case 'COURSELIST_GET_INSTANCES':
      return {
        ...state,
        instances: action.response
      }
    case 'COURSELIST_INSTANCE_CREATE':
      return {
        ...state,
        instances: [...state.instances, action.response.created]
      }
    default:
      return state
  }
}

export default listCoursesReducer

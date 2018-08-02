const INITIAL_STATE = {
  instances: [],
  courses: [],
  selectedCourse: undefined,
  selectedInstance: undefined
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
    case 'COURSELIST_COURSE_SELECT':
      return {
        ...state,
        selectedCourse: state.courses.find(course => course.id === action.id)
      }
    case 'COURSELIST_INSTANCE_SELECT':
      return {
        ...state,
        selectedInstance: state.instances.find(instance => instance.id === action.id)
      }
    case 'COURSELIST_INSTANCE_CREATE':
      return {
        ...state,
        instances: [...state.instances, action.response.created],
        selectedInstance: action.response.created
      }
    default:
      return state
  }
}

export default listCoursesReducer

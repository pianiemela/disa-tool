const INITIAL_STATE = {
  instances: [],
  courses: [],
  selectedCourse: null,
  selectedInstance: null
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
    case 'COURSELIST_REGISTER':
      return {
        ...state,
        instances: state.instances.map((instance) => {
          if (instance.id === action.response.created.course_instance_id) {
            return {
              ...instance,
              registered: true
            }
          }
          return instance
        }),
        selectedInstance: { ...state.selectedInstance, registered: true }
      }
    case 'COURSELIST_UNREGISTER':
      return {
        ...state,
        instances: state.instances.map((instance) => {
          if (instance.id === action.response.deleted.course_instance_id) {
            return {
              ...instance,
              registered: false
            }
          }
          return instance
        }),
        selectedInstance: { ...state.selectedInstance, registered: false }
      }
    case 'COURSE_CREATE':
      return {
        ...state,
        courses: [...state.courses, action.response.created],
        selectedCourse: action.response.created,
        instances: [],
        selectedInstance: null
      }
    default:
      return state
  }
}

export default listCoursesReducer

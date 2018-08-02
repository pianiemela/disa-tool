export const instanceReducer = (state = { tasks: [], self_assessments: [] }, action) => {
  switch (action.type) {
    case 'COURSES_GET_INSTANCE_DATA_SUCCESS':
      return action.payload
    case 'COURSES_GET_INSTANCE_DATA_FAILURE':
      return state
    case 'COURSE_INSTANCE_TOGGLE_ACTIVITY_SUCCESS':
      return { ...state, active: action.payload.active }
    case 'COURSE_INSTANCE_TOGGLE_ACTIVITY_FAILURE':
      return state
    default:
      return state
  }
}

export default instanceReducer


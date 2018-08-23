const INITIAL_STATE = { redirect: false }

const errorReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSES_GET_INSTANCE_DATA_FAILURE':
      return { ...state, redirect: true }
    case 'GET_SELF_ASSESMENT_FAILURE':
      return { ...state, redirect: true }
    case 'RESET_ERROR':
      return INITIAL_STATE
    default:
      return state
  }
}

export default errorReducer

import * as types from './action_types'

const INITIAL_STATE = { redirect: false }

const errorReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.COURSES_GET_INSTANCE_DATA_FAILURE:
      return { ...state, redirect: true }
    case types.GET_SELF_ASSESMENT_FAILURE:
      return { ...state, redirect: true }
    case types.RESET_ERROR:
      return INITIAL_STATE
    default:
      return state
  }
}

export default errorReducer

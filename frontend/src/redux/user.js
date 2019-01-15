import * as types from './action_types'

export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case types.USER_GET_SUCCESS:
      return action.payload === '' ? {} : action.payload
    case types.USER_GET_FAILURE:
      return state
    case types.USER_LOGIN_SUCCESS:
      return action.payload.logged_in
    default:
      return state
  }
}

export default userReducer

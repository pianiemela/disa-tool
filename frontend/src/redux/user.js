
export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'USER_GET_SUCCESS':
      return action.payload === '' ? {} : action.payload
    case 'USER_GET_FAILURE':
      return state
    case 'USER_LOGIN_SUCCESS':
      return action.payload.logged_in
    default:
      return state
  }
}

export default userReducer

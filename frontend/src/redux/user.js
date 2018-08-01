
export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'USER_GET_SUCCESS':
      return action.payload === '' ? {} : action.payload
    case 'USER_GET_FAILURE':
      return state
    case 'USER_LOGIN':
      return action.response.logged_in
    case 'USER_LOGOUT':
      return action.payload
    default:
      return state
  }
}

export default userReducer

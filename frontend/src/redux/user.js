
export const userReducer = (state = [], action) => {
  console.log(action)
  switch (action.type) {
    case 'GET_USER_SUCCESS':
      return action.payload
    case 'GET_USER_FAILURE':
      return state
    default:
      return state
  }
}

export default userReducer

const INITIAL_STATE = {
  types: []
}

const typeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSE_GET_DATA':
      return {
        ...state,
        types: action.response.data.types
      }
    case 'TYPE_REMOVE':
      console.log(action.response)
      return state
    default:
      return state
  }
}

export default typeReducer
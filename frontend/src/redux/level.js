const INITIAL_STATE = {
  levels: []
}

const levelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSE_GET_DATA':
      return {
        ...state,
        levels: action.response.data.levels
      }
    default:
      return state
  }
}

export default levelReducer

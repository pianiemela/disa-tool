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
    case 'LEVEL_CREATE':
      return {
        ...state,
        levels: [...state.levels, action.response.created]
      }
    default:
      return state
  }
}

export default levelReducer

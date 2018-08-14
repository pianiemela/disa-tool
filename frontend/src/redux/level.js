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
    case 'COURSE_GET_MATRIX':
      return {
        ...state,
        levels: action.response.data.levels
      }
    case 'LEVEL_CREATE':
      return {
        ...state,
        levels: [...state.levels, action.response.created]
      }
    case 'LEVEL_DELETE':
      return {
        ...state,
        levels: state.levels.filter(level => level.id !== action.response.deleted.id)
      }
    default:
      return state
  }
}

export default levelReducer

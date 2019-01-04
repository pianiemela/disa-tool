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
    case 'LEVEL_EDIT':
      return {
        ...state,
        levels: state.levels.map(level => (
          level.id === action.response.edited.id ? ({
            ...level,
            name: action.response.edited.name || level.name,
            order: action.response.edited.order || level.order
          }) : level
        ))
      }
    default:
      return state
  }
}

export default levelReducer

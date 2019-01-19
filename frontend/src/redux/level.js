import * as types from './action_types'

const INITIAL_STATE = {
  levels: []
}

const levelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.COURSE_GET_DATA:
      return {
        ...state,
        levels: action.response.data.levels
      }
    case types.COURSE_GET_MATRIX:
      return {
        ...state,
        levels: action.response.data.levels
      }
    case types.LEVEL_CREATE:
      return {
        ...state,
        levels: [...state.levels, action.response.created]
      }
    case types.LEVEL_DELETE:
      return {
        ...state,
        levels: state.levels.filter(level => level.id !== action.response.deleted.id)
      }
    case types.LEVEL_EDIT:
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

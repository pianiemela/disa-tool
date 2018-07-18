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
    case 'TYPE_CHANGE_MULTIPLIER': {
      const newTypes = [...state.types]
      let i = 0
      while (i < newTypes.length) {
        if (newTypes[i].id === action.data.id) {
          newTypes[i] = {
            ...newTypes[i],
            multiplier: action.data.multiplier
          }
          break
        }
        i += 1
      }
      return {
        ...state,
        types: newTypes
      }
    }
    case 'TYPE_DELETE': {
      const newTypes = [...state.types]
      let index = 0
      while (index < newTypes.length) {
        if (newTypes[index].id === action.response.deleted.id) {
          newTypes.splice(index, 1)
          break
        }
        index += 1
      }
      return { ...state, types: newTypes }
    }
    case 'TYPE_CREATE': {
      const newTypes = [...state.types]
      newTypes.push(action.response.created)
      return { ...state, types: newTypes }
    }
    default:
      return state
  }
}

export default typeReducer

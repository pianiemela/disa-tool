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
    case 'TYPE_CHANGE_MULTIPLIER':
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
        i++
      }
      return {
        ...state,
        types: newTypes
      }
    case 'TYPE_REMOVE':
      console.log(action.response) // TODO: implement removing type.
      return state
      case 'TYPE_ADD_NEW':
      console.log(action.response) // TODO: implement adding new type.
      return state
    default:
      return state
  }
}

export default typeReducer
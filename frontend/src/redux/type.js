const INITIAL_STATE = {
  headers: []
}

const typeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSE_GET_DATA':
      return {
        ...state,
        headers: action.response.data.type_headers
      }
    case 'TYPE_CHANGE_MULTIPLIER':
      return {
        ...state,
        headers: state.headers.map(header => (header.id === action.header_id ? {
          ...header,
          types: header.types.map(type => (type.id === action.type_id ? {
            ...type,
            multiplier: action.value
          } : type))
        } : header))
      }
    case 'TYPE_DELETE':
      return {
        ...state,
        headers: state.headers
          .map(header => (header.id === action.response.deleted.type_header_id ? {
            ...header,
            types: header.types.filter(type => type.id !== action.response.deleted.id)
          } : header))
      }
    case 'TYPE_CREATE':
      return {
        ...state,
        headers: state.headers
          .map(header => (header.id === action.response.created.type_header_id ? {
            ...header,
            types: [...header.types, {
              ...action.response.created,
              type_header_id: undefined
            }]
          } : header))
      }
    default:
      return state
  }
}

export default typeReducer

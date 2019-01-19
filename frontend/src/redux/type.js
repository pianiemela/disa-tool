import * as types from './action_types'

const INITIAL_STATE = {
  headers: []
}

const edit = (state, edited) => {
  const oldHeader = state.headers.find(header => header.types.find(type => type.id === edited.id))
  if (oldHeader.id === edited.type_header_id) {
    return {
      ...state,
      headers: state.headers.map(header => (
        header.id === edited.type_header_id ? ({
          ...header,
          types: header.types.map(type => (type.id === edited.id ? (edited) : type))
        }) : header
      ))
    }
  }
  return {
    ...state,
    headers: state.headers.map((header) => {
      switch (header.id) {
        case edited.type_header_id:
          return {
            ...header,
            types: [...header.types, edited]
          }
        case oldHeader.id:
          return {
            ...header,
            types: header.types.filter(type => type.id !== edited.id)
          }
        default:
          return header
      }
    })
  }
}

const typeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.COURSE_GET_DATA:
      return {
        ...state,
        headers: action.response.data.type_headers
      }
    case types.TYPE_EDIT:
      return edit(state, action.response.edited)
    case types.TYPE_DELETE:
      return {
        ...state,
        headers: state.headers
          .map(header => (header.id === action.response.deleted.type_header_id ? {
            ...header,
            types: header.types.filter(type => type.id !== action.response.deleted.id)
          } : header))
      }
    case types.TYPE_CREATE:
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
    case types.TYPE_HEADER_CREATE:
      return {
        ...state,
        headers: [...state.headers, action.response.created]
      }
    case types.TYPE_HEADER_DELETE:
      return {
        ...state,
        headers: state.headers.filter(header => header.id !== action.response.deleted.id)
      }
    case types.TYPE_HEADER_EDIT:
      return {
        ...state,
        headers: state.headers.map(header => (
          header.id === action.response.edited.id ? ({
            ...header,
            ...action.response.edited
          }) : header
        ))
      }
    default:
      return state
  }
}

export default typeReducer

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
    case 'TYPE_EDIT':
      return {
        ...state,
        headers: state.headers
          .map(header => (header.id === action.response.edited.type_header_id ? {
            ...header,
            types: header.types.map(type => (type.id === action.response.edited.id ? {
              ...type,
              ...action.response.edited,
              type_header_id: undefined
            } : type))
          } : header))
      }
    case 'TYPE_MOVE':
      return {
        ...state,
        headers: state.headers.map(header => (header.id === action.type_header_id ? ({
          ...header,
          types: header.types.map((type) => {
            switch (type.id) {
              case action.drag.id:
                return {
                  ...type,
                  order: action.hover.order
                }
              case action.hover.id:
                return {
                  ...type,
                  order: action.drag.order
                }
              default:
                return type
            }
          })
        }) : (
          header
        )))
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
    case 'TYPE_HEADER_CREATE':
      return {
        ...state,
        headers: [...state.headers, action.response.created]
      }
    case 'TYPE_HEADER_DELETE':
      return {
        ...state,
        headers: state.headers.filter(header => header.id !== action.response.deleted.id)
      }
    case 'TYPE_HEADER_EDIT':
      return {
        ...state,
        headers: state.headers.map(header => (
          header.id === action.response.edited.id ? ({
            ...header,
            name: action.response.edited.name
          }) : header
        ))
      }
    case 'TYPE_HEADER_MOVE':
      return {
        ...state,
        headers: state.headers.map((header) => {
          switch (header.id) {
            case action.drag.id:
              return {
                ...header,
                order: action.hover.order
              }
            case action.hover.id:
              return {
                ...header,
                order: action.drag.order
              }
            default:
              return header
          }
        })
      }
    default:
      return state
  }
}

export default typeReducer

const INITIAL_STATE = {
  categories: []
}

const categoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSE_GET_DATA':
      return {
        ...state,
        categories: action.response.data.categories
      }
    default:
      return state
  }
}

export default categoryReducer

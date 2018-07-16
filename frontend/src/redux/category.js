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
    case 'OBJECTIVE_CREATE': {
      const newObjective = {
        id: action.response.created.id,
        name: action.response.created.name
      }
      const newCategories = [...state.categories]
      newCategories
        .find(category => category.id === action.response.created.category_id).skill_levels
        .find(level => level.id === action.response.created.skill_level_id).objectives
        .push(newObjective)
      return {
        ...state,
        categories: newCategories
      }
    }
    default:
      return state
  }
}

export default categoryReducer

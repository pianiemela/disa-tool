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
    case 'OBJECTIVE_DELETE': {
      const newCategories = [...state.categories]
      const categoryToChange = newCategories.find(category => category.id === action.response.deleted.category_id)
      const newSkillLevels = [...categoryToChange.skill_levels]
      const levelToChange = newSkillLevels.find(level => level.id === action.response.deleted.skill_level_id)
      const newObjectives = [...levelToChange.objectives]
      let index = 0
      while (index < newObjectives.length) {
        if (newObjectives[index].id === action.response.deleted.id) {
          newObjectives.splice(index, 1)
          break
        }
        index += 1
      }
      levelToChange.objectives = newObjectives
      categoryToChange.skill_levels = newSkillLevels
      return { ...state, categories: newCategories }
    }
    case 'CATEGORY_CREATE':
      return {
        ...state,
        categories: [...state.categories, action.response.created]
      }
    default:
      return state
  }
}

export default categoryReducer

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
    case 'COURSE_GET_MATRIX':
      return {
        ...state,
        categories: action.response.data.categories
      }
    case 'OBJECTIVE_CREATE':
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category.id === action.response.created.category_id) {
            return {
              ...category,
              skill_levels: category.skill_levels.map((skillLevel) => {
                if (skillLevel.id === action.response.created.skill_level_id) {
                  return {
                    ...skillLevel,
                    objectives: [...skillLevel.objectives, {
                      id: action.response.created.id,
                      name: action.response.created.name
                    }]
                  }
                }
                return skillLevel
              })
            }
          }
          return category
        })
      }
    case 'OBJECTIVE_DELETE':
      return {
        ...state,
        categories: state.categories.map(category => (
          category.id === action.response.deleted.category_id ? (
            {
              ...category,
              skill_levels: category.skill_levels.map(skillLevel => (
                skillLevel.id === action.response.deleted.skill_level_id ? (
                  {
                    ...skillLevel,
                    objectives: skillLevel.objectives.filter(objective => (
                      objective.id !== action.response.deleted.id
                    ))
                  }
                ) : (
                  skillLevel
                )
              ))
            }
          ) : (
            category
          )))
      }
    case 'CATEGORY_CREATE':
      return {
        ...state,
        categories: [...state.categories, action.response.created]
      }
    case 'CATEGORY_DELETE':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.response.deleted.id)
      }
    case 'LEVEL_CREATE':
      return {
        ...state,
        categories: state.categories.map(category => ({
          ...category,
          skill_levels: [...category.skill_levels, {
            id: action.response.created.id,
            objectives: []
          }]
        }))
      }
    case 'LEVEL_DELETE':
      return {
        ...state,
        categories: state.categories.map(category => ({
          ...category,
          skill_levels: category.skill_levels
            .filter(level => level.id !== action.response.deleted.id)
        }))
      }
    case 'TASK_ATTACH_OBJECTIVE':
      return {
        ...state,
        categories: state.categories.map(category => ({
          ...category,
          skill_levels: category.skill_levels.map(level => ({
            ...level,
            objectives: level.objectives.map(objective => (
              objective.id === action.response.created.objective_id ? {
                ...objective,
                task_count: objective.task_count + 1
              } : objective))
          }))
        }))
      }
    case 'TASK_DETACH_OBJECTIVE':
      return {
        ...state,
        categories: state.categories.map(category => ({
          ...category,
          skill_levels: category.skill_levels.map(level => ({
            ...level,
            objectives: level.objectives.map(objective => (
              objective.id === action.response.deleted.objective_id ? {
                ...objective,
                task_count: objective.task_count - 1
              } : objective))
          }))
        }))
      }
    default:
      return state
  }
}

export default categoryReducer

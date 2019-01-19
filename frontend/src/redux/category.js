import * as types from './action_types'

const INITIAL_STATE = {
  categories: []
}

const objectiveEdit = (state, edited) => {
  let oldObjective
  let oldLevel
  const oldCategory = state.categories.find((category) => {
    oldLevel = category.skill_levels.find((level) => {
      oldObjective = level.objectives.find((
        objective => objective.id === edited.id
      ))
      return Boolean(oldObjective)
    })
    return Boolean(oldLevel)
  })
  const newObjective = {
    ...oldObjective,
    name: edited.name || oldObjective.name,
    order: edited.order || oldObjective.order
  }
  if (oldLevel.id === edited.skill_level_id && oldCategory.id === edited.category_id) {
    return {
      ...state,
      categories: state.categories.map(category => (
        category.id === edited.category_id ? {
          ...category,
          skill_levels: category.skill_levels.map(level => (
            level.id === edited.skill_level_id ? {
              ...level,
              objectives: level.objectives.map(objective => (
                objective.id === edited.id ? newObjective : objective
              ))
            } : level
          ))
        } : category
      ))
    }
  }
  return {
    ...state,
    categories: state.categories.map((category) => {
      let toReturn = category
      if (category.id === oldCategory.id) {
        toReturn = {
          ...toReturn,
          skill_levels: toReturn.skill_levels.map(level => (
            level.id === oldLevel.id ? {
              ...level,
              objectives: level.objectives.filter((
                objective => objective.id !== edited.id
              ))
            } : level
          ))
        }
      }
      if (category.id === edited.category_id) {
        toReturn = {
          ...toReturn,
          skill_levels: toReturn.skill_levels.map(level => (
            level.id === edited.skill_level_id ? {
              ...level,
              objectives: [...level.objectives, newObjective]
            } : level
          ))
        }
      }
      return toReturn
    })
  }
}

const categoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.COURSE_GET_DATA:
      return {
        ...state,
        categories: action.response.data.categories
      }
    case types.COURSE_GET_MATRIX:
      return {
        ...state,
        categories: action.response.data.categories
      }
    case types.OBJECTIVE_CREATE:
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
                      ...action.response.created,
                      category_id: undefined,
                      skill_level_id: undefined
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
    case types.OBJECTIVE_DELETE:
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
    case types.CATEGORY_CREATE:
      return {
        ...state,
        categories: [...state.categories, action.response.created]
      }
    case types.CATEGORY_DELETE:
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.response.deleted.id)
      }
    case types.LEVEL_CREATE:
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
    case types.LEVEL_DELETE:
      return {
        ...state,
        categories: state.categories.map(category => ({
          ...category,
          skill_levels: category.skill_levels
            .filter(level => level.id !== action.response.deleted.id)
        }))
      }
    case types.LEVEL_EDIT:
      return {
        ...state,
        categories: state.categories.map(category => ({
          ...category,
          skill_levels: category.skill_levels.map(level => (
            level.id === action.response.edited.id ? {
              ...level,
              order: action.response.edited.order
            } : level
          ))
        }))
      }
    case types.TASK_ATTACH_OBJECTIVE:
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
    case types.TASK_DETACH_OBJECTIVE:
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
    case types.OBJECTIVE_EDIT:
      return objectiveEdit(state, action.response.edited)
    case types.CATEGORY_EDIT:
      return {
        ...state,
        categories: state.categories.map(category => (
          category.id === action.response.edited.id ? ({
            ...category,
            name: action.response.edited.name || category.name,
            order: action.response.edited.order || category.order
          }) : category
        ))
      }
    default:
      return state
  }
}

export default categoryReducer

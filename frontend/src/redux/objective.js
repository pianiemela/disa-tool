const INITIAL_STATE = {
  objectives: []
}

const deleteMany = (state, action) => {
  const toDelete = {}
  action.response.deleted.tasks.forEach((task) => {
    task.objective_ids.forEach((id) => {
      toDelete[id] = true
    })
  })
  return {
    ...state,
    objectives: state.objectives.filter(objective => !toDelete[objective.id])
  }
}

const objectiveReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSE_GET_DATA': {
      let objectives = []
      // This parsing could be avoided,
      // but avoiding it would require redundant data being sent from backend.
      // I decided to do the parsing here, since its relatively fast. O(n)
      action.response.data.categories.forEach((category) => {
        category.skill_levels.forEach((level) => {
          objectives = objectives.concat(level.objectives)
        })
      })
      return {
        ...state,
        objectives
      }
    }
    case 'OBJECTIVE_CREATE': {
      const newObjective = {
        id: action.response.created.id,
        name: action.response.created.name
      }
      return {
        ...state,
        objectives: [...state.objectives, newObjective]
      }
    }
    case 'OBJECTIVE_DELETE': {
      const newObjectives = [...state.objectives]
      let index = 0
      while (index < newObjectives.length) {
        if (newObjectives[index].id === action.response.deleted.id) {
          newObjectives.splice(index, 1)
          break
        }
        index += 1
      }
      return { ...state, objectives: newObjectives }
    }
    case 'CATEGORY_DELETE':
      return deleteMany(state, action)
    case 'LEVEL_DELETE':
      return deleteMany(state, action)
    default:
      return state
  }
}

export default objectiveReducer

const INITIAL_STATE = {
  tasks: [],
  active: null
}

const detachObjectiveFromMany = (state, action) => {
  const deleteFrom = []
  action.response.deleted.task_ids.forEach((taskId) => {
    deleteFrom[taskId] = true
  })
  return {
    ...state,
    tasks: state.tasks.map((task) => {
      if (deleteFrom[task.id]) {
        return {
          ...task,
          objectives: task.types.filter(objective => objective.id !== action.response.deleted.id)
        }
      }
      return task
    })
  }
}

const detachTypeFromMany = (state, action) => {
  const deleteFrom = []
  action.response.deleted.task_ids.forEach((taskId) => {
    deleteFrom[taskId] = true
  })
  return {
    ...state,
    tasks: state.tasks.map((task) => {
      if (deleteFrom[task.id]) {
        return {
          ...task,
          types: task.types.filter(type => type !== action.response.deleted.id)
        }
      }
      return task
    })
  }
}

const detachManyObjectives = (state, action) => ({
  ...state,
  tasks: state.tasks.map((task) => {
    const deletionTask = action.response.deleted.tasks.find(delTask => delTask.id === task.id)
    if (!deletionTask) {
      return task
    }
    const toDelete = {}
    deletionTask.objective_ids.forEach((id) => {
      toDelete[id] = true
    })
    return {
      ...task,
      objectives: task.objectives.filter(objective => !toDelete[objective.id])
    }
  })
})

const detachOneObjective = (state, action) => ({
  ...state,
  tasks: state.tasks.map((task) => {
    if (task.id === action.response.deleted.task_id) {
      return {
        ...task,
        objectives: task.objectives.filter(objective => (
          objective.id !== action.response.deleted.objective_id
        ))
      }
    }
    return task
  })
})

const attachObjective = (state, action) => ({
  ...state,
  tasks: state.tasks.map((task) => {
    if (task.id === action.response.created.task_id) {
      return {
        ...task,
        objectives: [
          ...task.objectives,
          {
            id: action.response.created.objective_id,
            multiplier: 1
          }
        ]
      }
    }
    return task
  })
})

const detachOneType = (state, action) => ({
  ...state,
  tasks: state.tasks.map((task) => {
    if (task.id === action.response.deleted.task_id) {
      return {
        ...task,
        types: task.types.filter(type => (
          type !== action.response.deleted.type_id
        ))
      }
    }
    return task
  })
})

const attachType = (state, action) => ({
  ...state,
  tasks: state.tasks.map((task) => {
    if (task.id === action.response.created.task_id) {
      return {
        ...task,
        types: [
          ...task.types,
          action.response.created.type_id
        ]
      }
    }
    return task
  })
})

const taskReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSE_GET_DATA':
      return {
        ...state,
        tasks: action.response.data.tasks
      }
    case 'TASK_CHANGE_OBJECTIVE_MULTIPLIER': {
      const newTasks = [...state.tasks]
      let i = 0
      while (i < newTasks.length) {
        if (newTasks[i].id === action.data.taskId) {
          const newTask = { ...newTasks[i] }
          let j = 0
          while (j < newTask.objectives.length) {
            if (newTask.objectives[j].id === action.data.objectiveId) {
              newTask.objectives[j] = {
                ...newTask.objectives[j],
                multiplier: action.data.multiplier
              }
              break
            }
            j += 1
          }
          newTasks[i] = newTask
          break
        }
        i += 1
      }
      return {
        ...state,
        tasks: newTasks
      }
    }
    case 'TASK_CHANGE_ACTIVE':
      return {
        ...state,
        active: state.active === action.id ? null : action.id
      }
    case 'TASK_CREATE':
      return {
        ...state,
        tasks: [...state.tasks, action.response.created]
      }
    case 'TASK_DELETE':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.response.deleted.id)
      }
    case 'TASK_ADD_TYPE':
      console.log(action.response)
      return state
    case 'TASK_REMOVE_TYPE':
      console.log(action.response)
      return state
    case 'TASK_ATTACH_OBJECTIVE':
      return attachObjective(state, action)
    case 'TASK_DETACH_OBJECTIVE':
      return detachOneObjective(state, action)
    case 'TASK_ATTACH_TYPE':
      return attachType(state, action)
    case 'TASK_DETACH_TYPE':
      return detachOneType(state, action)
    case 'OBJECTIVE_DELETE':
      return detachObjectiveFromMany(state, action, 'objectives')
    case 'TYPE_DELETE':
      return detachTypeFromMany(state, action, 'types')
    case 'CATEGORY_DELETE':
      return detachManyObjectives(state, action)
    case 'LEVEL_DELETE':
      return detachManyObjectives(state, action)
    default:
      return state
  }
}

export default taskReducer

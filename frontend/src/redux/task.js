const INITIAL_STATE = {
  tasks: []
}

const detach = (state, action, field) => {
  const changes = []
  action.response.deleted.task_ids.forEach((taskId) => {
    changes[taskId] = true
  })
  const newTasks = state.tasks.map((task) => {
    if (changes[task.id]) {
      const newField = [...task[field]]
      let index = 0
      while (index < newField.length) {
        if (newField[index].id === action.response.deleted.id) {
          newField.splice(index, 1)
          break
        }
        index += 1
      }
      return {
        ...task,
        [field]: newField
      }
    }
    return task
  })
  return { ...state, tasks: newTasks }
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
    case 'TASK_ADD_OBJECTIVE':
      console.log(action.response)
      return state
    case 'TASK_REMOVE_OBJECTIVE':
      console.log(action.response)
      return state
    case 'OBJECTIVE_DELETE':
      return detach(state, action, 'objectives')
    case 'TYPE_DELETE':
      return detach(state, action, 'types')
    case 'CATEGORY_DELETE':
      return detachManyObjectives(state, action)
    case 'LEVEL_DELETE':
      return detachManyObjectives(state, action)
    default:
      return state
  }
}

export default taskReducer

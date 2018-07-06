const INITIAL_STATE = {
  tasks: []
}

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
      console.log(action.response)
      return state
    case 'TASK_DELETE':
      console.log(action.response)
      return state
    case 'TASK_ADD_TYPE':
      console.log(action.response)
      return state
    case 'TASK_REMOVE_TYPE':
      console.log(action.response)
      return state
    default:
      return state
  }
}

export default taskReducer

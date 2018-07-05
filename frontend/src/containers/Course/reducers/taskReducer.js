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
            j++
          }
          newTasks[i] = newTask
          break
        }
        i++
      }
      return {
        ...state,
        tasks: newTasks
      }
    }
    default:
      return state
  }
}

export default taskReducer
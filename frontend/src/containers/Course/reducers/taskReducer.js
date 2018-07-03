const INITIAL_STATE = {
  tasks: []
}

const taskReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'TASK_GET_FOR_COURSE':
      return {
        ...state,
        tasks: action.response.data.tasks
      }
    default:
      return state
  }
}

export default taskReducer
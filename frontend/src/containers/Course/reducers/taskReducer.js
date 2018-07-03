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
    default:
      return state
  }
}

export default taskReducer
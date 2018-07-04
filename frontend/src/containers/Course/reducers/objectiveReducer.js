const INITIAL_STATE = {
  objectives: []
}

const objectiveReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSE_GET_DATA':
      return {
        ...state,
        objectives: action.response.data.objectives
      }
    default:
      return state
  }
}

export default objectiveReducer
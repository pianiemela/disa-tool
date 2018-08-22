const INITIAL_STATE = {
  cut: null
}

const objectiveReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'OBJECTIVE_CUT':
      return {
        ...state,
        cut: action.cut
      }
    case 'OBJECTIVE_MOVE':
      return INITIAL_STATE
    default:
      return state
  }
}

export default objectiveReducer

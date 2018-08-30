const INITIAL_STATE = {
  cut: null,
  last_cut: null
}

const objectiveReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'OBJECTIVE_CUT':
      return {
        ...state,
        cut: action.cut
      }
    case 'OBJECTIVE_MOVE':
      return {
        ...state,
        cut: null,
        last_cut: state.cut
      }
    case 'COURSE_RESET':
      return INITIAL_STATE
    default:
      return state
  }
}

export default objectiveReducer

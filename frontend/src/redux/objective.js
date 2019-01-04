const INITIAL_STATE = {
  draggging: null
}

const objectiveReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'OBJECTIVE_DRAG_START':
      return {
        ...state,
        draggging: action.cell
      }
    case 'OBJECTIVE_DRAG_STOP':
      return {
        ...state,
        draggging: null
      }
    default:
      return state
  }
}

export default objectiveReducer

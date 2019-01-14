const INITIAL_STATE = {
  selfAssesmentId: null,
  selfAssesmentName: null,
  responses: [],
  selectedResponses: [],
  activeResponse: null
}

const selfAssesmentListReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SELF_ASSESMENT_LIST_INIT':
      return {
        ...state,
        selfAssesmentId: action.selfAssesmentId,
        selfAssesmentName: action.selfAssesmentName,
        responses: action.responses || []
      }
    case 'SELF_ASSESMENT_LIST_RESET':
      return INITIAL_STATE
    case 'SELF_ASSESMENT_LIST_SELECT_RESPONSE': {
      const { selectedResponses } = state
      const newSelectedResponses = (
        selectedResponses.find(resp => resp.id === action.selected.id)
      ) ? (
          selectedResponses.filter(resp => resp.id !== action.selected.id)
        ) : (
          [...selectedResponses, action.selected]
        )
      return {
        ...state,
        selectedResponses: newSelectedResponses
      }
    }
    case 'SELF_ASSESMENT_LIST_ACTIVATE_RESPONSE':
      return {
        ...state,
        activeResponse: action.activated
      }
    case 'SELF_ASSESMENT_LIST_SELECT_ALL':
      return {
        ...state,
        selectedResponses: state.responses
      }
    case 'SELF_ASSESMENT_LIST_DESELECT_ALL':
      return {
        ...state,
        selectedResponses: []
      }
    case 'SELF_ASSESMENT_LIST_REGENERATE':
      return {
        ...state,
        selectedResponses: state.selectedResponses.filter((
          response => !action.newResponses.find(newResponse => newResponse.id === response.id)
        )).concat(action.newResponses),
        responses: state.responses.filter((
          response => !action.newResponses.find(newResponse => newResponse.id === response.id)
        )).concat(action.newResponses)
      }
    default:
      return state
  }
}

export default selfAssesmentListReducer

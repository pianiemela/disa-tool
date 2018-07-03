const INITIAL_STATE = {
  skills: []
}

const skillReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SKILL_GET_FOR_COURSE':
      return {
        ...state,
        skills: action.response.data.skills
      }
    default:
      return state
  }
}

export default skillReducer
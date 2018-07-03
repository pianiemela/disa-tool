const INITIAL_STATE = {
  skills: []
}

const skillReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSE_GET_DATA':
      return {
        ...state,
        skills: action.response.data.skills
      }
    default:
      return state
  }
}

export default skillReducer
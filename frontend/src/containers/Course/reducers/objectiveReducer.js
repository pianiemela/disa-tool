const INITIAL_STATE = {
  objectives: []
}

const objectiveReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'COURSE_GET_DATA': {
      let objectives = []
      // This parsing could be avoided,
      // but avoiding it would require redundant data being sent from backend.
      // I decided to do the parsing here, since its relatively fast. O(n)
      action.response.data.categories.forEach((category) => {
        category.skill_levels.forEach((level) => {
          objectives = objectives.concat(level.objectives)
        })
      })
      return {
        ...state,
        objectives
      }
    }
    case 'OBJECTIVE_CREATE':
      console.log(action.repsonse)
      return state
    default:
      return state
  }
}

export default objectiveReducer

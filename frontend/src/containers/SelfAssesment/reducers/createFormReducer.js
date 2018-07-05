const INITIAL_STATE = {
  selfAssesments: {},
  courseData: {}
}


const createFormReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INIT_FORM_STRUCTURE':
      return { ...state, [action.data.type]: action.data }
    case 'GET_SELF_ASSESMENT_DATA': {
      const { selfAssesmentData } = action.apiresponse.data
      return { ...state, courseData: selfAssesmentData }
    }
    case 'GET_ALL_SELF_ASSESMENTS': {
      console.log('are we here')
      const { existingSelfAssesments } = action.apiresponse.data
      return { ...state, selfAssesments: existingSelfAssesments }
    }
    default:
      return state
  }
}


export const createFormJSONStucture = dispatch => (
  (data) => {
    dispatch({
      type: 'INIT_FORM_STRUCTURE',
      data
    })
  }
)
export default createFormReducer

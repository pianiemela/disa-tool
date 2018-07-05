const INITIAL_STATE = {
    objectives: {},
    category: {},
    courseData: {}
}


const createFormReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'INIT_FORM_STRUCTURE':
            return { ...state, [action.data.type]: action.data }
        case 'GET_SELF_ASSESMENT_DATA':
            const { selfAssesmentData } = action.apiresponse.data
            return { ...state, courseData: selfAssesmentData }
        default:
            return state
    }
}


export const createFormJSONStucture = (dispatch) => {
    return (data) => {
        dispatch({
            type: 'INIT_FORM_STRUCTURE',
            data
        })
    }

}
export default createFormReducer
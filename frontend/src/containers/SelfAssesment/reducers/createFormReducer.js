const INITIAL_STATE = {
    objectives: {},
    category: {},
    courseData: {}
}


const createFormReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'INIT_FORM_STRUCTURE':
        console.log(action.data.parsedData.type)
            return { ...state, [action.data.parsedData.type]: action.data.parsedData }
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
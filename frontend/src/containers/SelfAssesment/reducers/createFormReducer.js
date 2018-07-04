const INITIAL_STATE = {
    categoryFormStructure: {},
    objectiveFormStructure: {},
    formData: {}
}


const createFormReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'GET_SELF_ASSESMENT_DATA':
            const { selfAssesmentData } = action.apiresponse.data
            return {...state, formData: selfAssesmentData }
        default:
            return state
    }
}

export default createFormReducer
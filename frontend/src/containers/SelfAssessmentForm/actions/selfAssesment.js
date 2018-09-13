export const toggleTextField = id => (dispatch) => {
  dispatch({
    type: 'TOGGLE_TEXT_FIELD',
    payload: id
  })
}

export const initNewFormAction = data => (dispatch) => {
  dispatch({
    type: 'INIT_NEW_FORM',
    payload: data
  })
}

export const toggleUp = id => (dispatch) => {
  dispatch({
    type: 'TOGGLE_UP',
    payload: id
  })
}

export const toggleDown = id => (dispatch) => {
  dispatch({
    type: 'TOGGLE_DOWN',
    payload: id
  })
}

export const addOpenQuestion = questionData => (dispatch) => {
  dispatch({
    type: 'ADD_OPEN_QUESTION',
    payload: questionData
  })
}

export const removeOpenQuestion = id => (dispatch) => {
  dispatch({
    type: 'REMOVE_OPEN_QUESTION',
    payload: id
  })
}

export const changeTextField = data => (dispatch) => {
  dispatch({
    type: 'CHANGE_TEXT_FIELD',
    payload: data

  })
}

export const toggleFormPartAction = (id, type) => (dispatch) => {
  dispatch({
    type: 'TOGGLE_FORM_PART',
    payload: { id, type }
  })
}

export const changeHeaderAction = data => (dispatch) => {
  dispatch({
    type: 'CHANGE_HEADER',
    payload: data
  })
}

export const editFormAction = data => (dispatch) => {
  dispatch({
    type: 'INIT_EDIT_FORM',
    payload: data
  })
}

export const openQuestionResponseAction = data => (dispatch) => {
  dispatch({
    type: 'OPEN_QUESTION_RESPONSE',
    payload: data
  })
}

export const gradeCategoryAction = data => (dispatch) => {
  dispatch({
    type: 'GRADE_CATEGORY_RESPONSE',
    payload: data
  })
}

export const gradeObjectiveAction = data => (dispatch) => {
  dispatch({
    type: 'GRADE_OBJECTIVE_RESPONSE',
    payload: data
  })
}

export const textfieldResponseAction = data => (dispatch) => {
  dispatch({
    type: 'TEXTFIELD_RESPONSE',
    payload: data
  })
}

export const validationAction = data => (dispatch) => {
  dispatch({
    type: 'VALIDATE_RESPONSE',
    payload: data
  })
}

export const clearErrorAction = data => (dispatch) => {
  dispatch({
    type: 'CLEAR_RESPONSE_ERROR',
    payload: data
  })
}

export const clearValidationAction = () => (dispatch) => {
  dispatch({
    type: 'CLEAR_VALIDATION',
    payload: null
  })
}

export const closeModalAction = () => (dispatch) => {
  dispatch({
    type: 'CLOSE_MODAL',
    payload: null
  })
}

export const clearAssessmentAction = () => (dispatch) => {
  dispatch({
    type: 'CLEAR_ASSESSMENT',
    payload: null
  })
}

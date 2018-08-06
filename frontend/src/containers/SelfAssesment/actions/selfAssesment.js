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

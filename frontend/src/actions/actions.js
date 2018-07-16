import { getJson, postJson } from '../utils/utils'

export const getUsersCourses = () => getJson('/courses/user')

export const getCategoriesForCourse = courseId => getJson(`/categories/${courseId}`)

export const getUser = () => getJson('/persons/user')

export const createSelfAssesment = () => postJson('/selfassesment/create')

export const getUserAction = () => async (dispatch) => {
  dispatch({
    type: 'GET_USER_ATTEMPT',
    payload: ''
  })
  try {
    const { data } = await getUser()
    dispatch({
      type: 'GET_USER_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'GET_USER_FAILURE',
      payload: e.response
    })
  }
}

export const getUserCoursesAction = () => async (dispatch) => {
  dispatch({
    type: 'GET_USER_COURSES_ATTEMPT',
    payload: ''
  })
  try {
    const { data } = await getUsersCourses()
    dispatch({
      type: 'GET_USER_COURSES_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'GET_USER_COURSES_FAILURE',
      payload: e.response
    })
  }
}

export const toggleTextField = id => (dispatch) => {
  dispatch({
    type: 'TOGGLE_TEXT_FIELD',
    payload: id
  })
}

export const initCreateForm = data => (dispatch) => {
  dispatch({
    type: 'INIT_FORM',
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

export const changeTextField = (type, value) => (dispatch) => {
  dispatch({
    type: 'CHANGE_TEXT_FIELD',
    payload: { type, value }

  })
}

export const createForm = data => async (dispatch) => {
  dispatch({
    type: 'CREATE_SELF_ASSESMENT_ATTEMPT',
    payload: ''
  })

  try {
    const res = await createSelfAssesment(data)
    dispatch({
      type: 'CREATE_SELF_ASSESMENT_SUCCESS',
      payload: res
    })
  } catch (error) {
    dispatch({
      type: 'CREATE_SELF_ASSESMENT_FAILURE',
      payload: error

    })
  }
}

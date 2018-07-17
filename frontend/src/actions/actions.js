import { getJson } from '../utils/utils'

export const getUsersCourses = () => getJson('/courses/user')

export const getCategoriesForCourse = courseId => getJson(`/categories/${courseId}`)

export const getUser = () => getJson('/persons/user')

export const getUserAction = () => async (dispatch) => {
  dispatch({
    type: 'USER_GET_ATTEMPT',
    payload: ''
  })
  try {
    const { data } = await getUser()
    dispatch({
      type: 'USER_GET_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'USER_GET_FAILURE',
      payload: e.response
    })
  }
}

export const getUserCoursesAction = () => async (dispatch) => {
  dispatch({
    type: 'USER_GET_COURSES_ATTEMPT',
    payload: ''
  })
  try {
    const { data } = await getUsersCourses()
    dispatch({
      type: 'USER_GET_COURSES_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'USER_GET_COURSES_FAILURE',
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

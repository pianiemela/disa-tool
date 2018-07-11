import { getJson } from '../utils/utils'

export const getUsersCourses = () => getJson('/courses/user')

export const getCategoriesForCourse = courseId => getJson(`/categories/${courseId}`)

export const getUser = () => getJson('/persons/user')

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

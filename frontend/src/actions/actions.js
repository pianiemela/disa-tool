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

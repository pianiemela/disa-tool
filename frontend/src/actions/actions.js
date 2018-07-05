import { getJson } from '../utils/utils'

export const getUsersCourses = () => getJson('/courses/user')

export const getCategoriesForCourse = courseId => getJson(`/categories/${courseId}`)

export const getUser = () => getJson('/persons/user')

export const getUserAction = () => async (dispatch) => {
  const { data } = await getUser()
  dispatch({
    type: 'GET_USER',
    payload: data
  })
}

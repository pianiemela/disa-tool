import * as types from '../../../redux/action_types'
import { getCourses, editCourse as edit } from '../../../api/courses'
import apiPromise from '../../../utils/apiPromise';

export const selectCourse = dispatch => id => dispatch({
  type: types.COURSELIST_COURSE_SELECT,
  id
})

export const getAllCourses = () => new Promise((resolve) => {
  getCourses().then((response) => {
    resolve({
      type: types.COURSELIST_GET_COURSES,
      response: response.data
    })
  })
})

export const editCourse = data => apiPromise(edit, data, {
  success: { type: types.COURSE_EDIT}
})
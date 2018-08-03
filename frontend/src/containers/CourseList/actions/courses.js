import { getCourses } from '../../../api/courses'

export const selectCourse = dispatch => id => dispatch({
  type: 'COURSELIST_COURSE_SELECT',
  id
})

export const getAllCourses = () => new Promise((resolve) => {
  getCourses().then((response) => {
    resolve({
      type: 'COURSELIST_GET_COURSES',
      response: response.data
    })
  })
})

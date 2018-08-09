import { create, getByCourse } from '../../../api/courseInstances'

export const selectInstance = dispatch => id => dispatch({
  type: 'COURSELIST_INSTANCE_SELECT',
  id
})

export const addInstance = data => new Promise((resolve) => {
  create(data).then((response) => {
    resolve({
      type: 'COURSELIST_INSTANCE_CREATE',
      response: response.data
    })
  })
})

export const getInstancesOfCourse = courseId => new Promise((resolve) => {
  getByCourse(courseId).then((response) => {
    resolve({
      type: 'COURSELIST_GET_INSTANCES',
      response: response.data
    })
  })
})

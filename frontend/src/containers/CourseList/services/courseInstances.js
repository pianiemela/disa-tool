import { postJson, getJson } from '../../../utils/utils'

export const addInstance = data => new Promise((resolve) => {
  postJson('/course-instances/create', data).then((response) => {
    resolve({
      type: 'COURSE_INSTANCE_CREATE',
      response: response.data
    })
  })
})

export const getInstancesOfCourse = courseId => new Promise((resolve) => {
  getJson(`/courses/${courseId}`).then((response) => {
    resolve({
      type: 'COURSELIST_GET_INSTANCES',
      response: response.data
    })
  })
})

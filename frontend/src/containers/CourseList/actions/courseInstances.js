import * as types from '../../../redux/action_types'
import { create, copy, getByCourse, edit } from '../../../api/courseInstances'
import apiPromise from '../../../utils/apiPromise'

export const selectInstance = dispatch => id => dispatch({
  type: types.COURSELIST_INSTANCE_SELECT,
  id
})

export const addInstance = data => new Promise((resolve) => {
  const creationFunction = data.course_instance_id ? copy : create
  creationFunction(data).then((response) => {
    resolve({
      type: types.COURSELIST_INSTANCE_CREATE,
      response: response.data
    })
  })
})

export const getInstancesOfCourse = courseId => new Promise((resolve) => {
  getByCourse(courseId).then((response) => {
    resolve({
      type: types.COURSELIST_GET_INSTANCES,
      response: response.data
    })
  })
})

export const getTemplateInstances = templateCourseId => new Promise((resolve) => {
  getByCourse(templateCourseId).then((response) => {
    resolve({
      type: types.COURSELIST_GET_TEMPLATE_INSTANCES,
      response: response.data
    })
  })
})

export const editInstance = data => apiPromise(edit, data, {
  success: { type: types.COURSELIST_INSTANCE_EDIT }
})

import * as types from '../../../redux/action_types'
import { changeCourseRole, deleteCP } from '../../../api/coursePersons'
import apiPromise from '../../../utils/apiPromise'

export const adminChangeCourseRole = data => apiPromise(changeCourseRole, data, {
  success: { type: types.ADMIN_COURSE_CHANGE_ROLE }
})

export const addPersonToCourse = data => apiPromise(
  changeCourseRole,
  {
    ...data,
    course_instance: undefined
  },
  {
    success: {
      course_instance: data.course_instance,
      type: types.ADMIN_ADD_TO_COURSE
    }
  }
)

export const removeCoursePerson = data => apiPromise(deleteCP, data, {
  success: { type: types.ADMIN_DELETE_ROLE }
})

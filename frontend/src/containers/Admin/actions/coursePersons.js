import { changeCourseRole } from '../../../api/coursePersons'
import apiPromise from '../../../utils/apiPromise'

export const adminChangeCourseRole = data => apiPromise(changeCourseRole, data, {
  success: { type: 'ADMIN_COURSE_CHANGE_ROLE' }
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
      type: 'ADMIN_ADD_TO_COURSE'
    }
  }
)

import { changeCourseRole } from '../../../api/coursePersons'
import apiPromise from '../../../utils/apiPromise'

export const adminChangeCourseRole = data => apiPromise(changeCourseRole, data, {
  success: { type: 'ADMIN_COURSE_CHANGE_ROLE' }
})

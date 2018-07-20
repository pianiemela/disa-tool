import { postJson } from '../../../utils/utils'

export const addCategory = data => postJson(
  '/categories/create',
  data,
  ['logged_in', `teacher_on_course:${data.course_instance_id}`]
)

export const removeCategory = () => {}

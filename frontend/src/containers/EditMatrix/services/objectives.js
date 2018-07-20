import { deleteCall, postJson } from '../../../utils/utils'
import { privilegeCode } from '../../../utils/privilege'

export const addObjective = data => new Promise((resolve) => {
  postJson(
    '/objectives/create',
    data,
    [privilegeCode('logged_in'), privilegeCode('teacher_on_course', data.course_instance_id)]
  ).then(response => resolve({
    type: 'OBJECTIVE_CREATE',
    response: response.data
  }))
})

export const removeObjective = data => new Promise((resolve) => {
  deleteCall(
    `/objectives/${data.id}`,
    [privilegeCode('logged_in'), privilegeCode('teacher_on_course', data.course_instance_id)]
  ).then(response => resolve({
    type: 'OBJECTIVE_DELETE',
    response: response.data
  }))
})

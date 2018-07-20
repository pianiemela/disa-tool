import { deleteCall, postJson } from '../../../utils/utils'
import { privileges } from '../../../utils/privilege'

export const addObjective = data => new Promise((resolve) => {
  postJson(
    '/objectives/create',
    data,
    privileges([
      {
        key: 'logged_in'
      },
      {
        key: 'teacher_on_course',
        param: data.course_instance_id
      }
    ])
  ).then(response => resolve({
    type: 'OBJECTIVE_CREATE',
    response: response.data
  }))
})

export const removeObjective = data => new Promise((resolve) => {
  deleteCall(
    `/objectives/${data.id}`,
    privileges([
      {
        key: 'logged_in'
      },
      {
        key: 'teacher_on_course',
        param: data.course_instance_id
      }
    ])
  ).then(response => resolve({
    type: 'OBJECTIVE_DELETE',
    response: response.data
  }))
})

import { deleteCall, postJson } from '../../../utils/utils'
import { privileges } from '../../../utils/privilege'

export const addType = data => new Promise((resolve) => {
  postJson(
    '/types/create',
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
    type: 'TYPE_CREATE',
    response: response.data
  }))
})

export const removeType = data => new Promise((resolve) => {
  deleteCall(
    `/types/${data.id}`,
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
    type: 'TYPE_DELETE',
    response: response.data
  }))
})

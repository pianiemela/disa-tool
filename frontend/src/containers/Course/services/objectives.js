import { deleteCall, postJson } from '../../../utils/utils'

export const addObjective = data => new Promise((resolve) => {
  postJson('/objectives/create', data, ['logged_in', 'teacher_on_course']).then(response => resolve({
    type: 'OBJECTIVE_CREATE',
    response: response.data
  }))
})

export const removeObjective = data => new Promise((resolve) => {
  deleteCall(`/objectives/${data.id}`, ['logged_in', 'teacher_on_course']).then(response => resolve({
    type: 'OBJECTIVE_DELETE',
    response: response.data
  }))
})

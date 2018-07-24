import { postJson, deleteCall } from '../../../utils/utils'

export const addLevel = data => new Promise((resolve) => {
  postJson('/skill-levels/create', data).then(response => resolve({
    type: 'LEVEL_CREATE',
    response: response.data
  }))
})

export const removeLevel = data => new Promise((resolve) => {
  deleteCall(`/skill-levels/${data.id}`).then(response => resolve({
    type: 'LEVEL_DELETE',
    response: response.data
  }))
})

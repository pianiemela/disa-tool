import { create, remove } from '../../../api/objectives'

export const addObjective = data => new Promise((resolve) => {
  create(data).then(response => resolve({
    type: 'OBJECTIVE_CREATE',
    response: response.data
  }))
})

export const removeObjective = data => new Promise((resolve) => {
  remove(data).then(response => resolve({
    type: 'OBJECTIVE_DELETE',
    response: response.data
  }))
})

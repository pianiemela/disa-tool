import { create, remove } from '../../../api/skillLevels'

export const addLevel = data => new Promise((resolve) => {
  create(data).then(response => resolve({
    type: 'LEVEL_CREATE',
    response: response.data
  }))
})

export const removeLevel = data => new Promise((resolve) => {
  remove(data).then(response => resolve({
    type: 'LEVEL_DELETE',
    response: response.data
  }))
})

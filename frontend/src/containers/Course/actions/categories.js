import { create, remove } from '../../../api/categories'

export const addCategory = data => new Promise((resolve) => {
  create(data).then(response => resolve({
    type: 'CATEGORY_CREATE',
    response: response.data
  }))
})

export const removeCategory = data => new Promise((resolve) => {
  remove(data).then(response => resolve({
    type: 'CATEGORY_DELETE',
    response: response.data
  }))
})

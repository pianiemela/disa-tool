import { postJson, deleteCall } from '../../../utils/utils'

export const addCategory = data => new Promise((resolve) => {
  postJson('/categories/create', data).then(response => resolve({
    type: 'CATEGORY_CREATE',
    response: response.data
  }))
})

export const removeCategory = data => new Promise((resolve) => {
  deleteCall(`/categories/${data.id}`).then(response => resolve({
    type: 'CATEGORY_DELETE',
    response: response.data
  }))
})

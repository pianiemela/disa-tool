import { deleteCall, postJson } from '../../../utils/utils'

export const addType = data => new Promise((resolve) => {
  postJson('/types/create', data).then(response => resolve({
    type: 'TYPE_CREATE',
    response: response.data
  }))
})

export const removeType = data => new Promise((resolve) => {
  deleteCall(`/types/${data.id}`).then(response => resolve({
    type: 'TYPE_DELETE',
    response: response.data
  }))
})

export const addHeader = data => new Promise((resolve) => {
  postJson('/types/headers/create', data).then(response => resolve({
    type: 'TYPE_HEADER_CREATE',
    response: response.data
  }))
})

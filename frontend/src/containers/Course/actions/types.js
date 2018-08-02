import { create, remove, headerCreate, headerRemove } from '../../../api/types'

export const addType = data => new Promise((resolve) => {
  create(data).then(response => resolve({
    type: 'TYPE_CREATE',
    response: response.data
  }))
})

export const removeType = data => new Promise((resolve) => {
  remove(data).then(response => resolve({
    type: 'TYPE_DELETE',
    response: response.data
  }))
})

export const addHeader = data => new Promise((resolve) => {
  headerCreate(data).then(response => resolve({
    type: 'TYPE_HEADER_CREATE',
    response: response.data
  }))
})

export const removeHeader = data => new Promise((resolve) => {
  headerRemove(data).then(response => resolve({
    type: 'TYPE_HEADER_DELETE',
    response: response.data
  }))
})

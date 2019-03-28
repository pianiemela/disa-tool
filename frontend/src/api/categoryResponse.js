import { postJson, getJson, putJson, deleteCall } from '../utils/utils'

export const create = data => postJson('/category-response/create', data)

export const getByResponse = id => getJson(`/category-response/response/${id}`)

export const edit = (id, data) => putJson(`/category-response/${id}`, data)

export const remove = id => deleteCall(`/category-response/response/${id}`)

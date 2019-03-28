import { postJson, getJson, putJson, deleteCall } from '../utils/utils'

export const create = data => postJson('/open-response/create', data)

export const getByResponse = id => getJson(`/open-response/response/${id}`)

export const edit = (id, data) => putJson(`/open-response/${id}`, data)

export const remove = id => deleteCall(`/open-response/response/${id}`)

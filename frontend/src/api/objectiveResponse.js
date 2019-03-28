import { postJson, getJson, putJson, deleteCall } from '../utils/utils'

export const create = data => postJson('/objective-response/create', data)

export const getByResponse = id => getJson(`/objective-response/response/${id}`)

export const edit = (id, data) => putJson(`/objective-response/${id}`, data)

export const remove = id => deleteCall(`/objective-response/response/${id}`)

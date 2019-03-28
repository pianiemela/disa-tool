import { postJson, getJson, putJson, deleteCall } from '../utils/utils'

export const create = data => postJson('/final-grade-response/create', data)

export const getByResponse = id => getJson(`/final-grade-response/response/${id}`)

export const edit = (id, data) => putJson(`/final-grade-response/${id}`, data)

export const remove = id => deleteCall(`/final-grade-response/response/${id}`)

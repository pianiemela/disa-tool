import { getJson, putJson, postJson } from '../utils/utils'

export const create = data => postJson('/self-assessment-form/create', data)

export const read = id => getJson(`/self-assessment-form/${id}`)

export const update = (id, data) => putJson(`/self-assessment-form/${id}`, data)

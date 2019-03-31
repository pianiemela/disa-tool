import { postJson, getJson } from '../utils/utils'

export const create = data => postJson('/responses/create', data)

export const getMine = id => getJson(`/responses/self-assessment-form/${id}/me`)

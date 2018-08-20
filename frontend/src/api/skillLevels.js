import { postJson, deleteCall, getJson, putJson } from '../utils/utils'

export const create = data => postJson('/skill-levels/create', data)

export const remove = data => deleteCall(`/skill-levels/${data.id}`)

export const details = data => getJson(`/skill-levels/${data.id}`)

export const edit = data => putJson(`/skill-levels/${data.id}`, { ...data, id: undefined })

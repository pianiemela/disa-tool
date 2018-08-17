import { deleteCall, postJson, getJson } from '../utils/utils'

export const create = data => postJson('/objectives/create', data)

export const remove = data => deleteCall(`/objectives/${data.id}`)

export const taskDetails = data => getJson(`/objectives/tasks/${data.id}`)

import { deleteCall, postJson } from '../utils/utils'

export const create = data => postJson('/objectives/create', data)

export const remove = data => deleteCall(`/objectives/${data.id}`)

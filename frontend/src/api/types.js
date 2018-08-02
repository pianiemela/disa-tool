import { deleteCall, postJson } from '../utils/utils'

export const create = data => postJson('/types/create', data)

export const remove = data => deleteCall(`/types/${data.id}`)

export const headerCreate = data => postJson('/types/headers/create', data)

export const headerRemove = data => deleteCall(`/types/headers/${data.id}`)

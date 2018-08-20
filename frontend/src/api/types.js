import { getJson, postJson, putJson, deleteCall } from '../utils/utils'

export const create = data => postJson('/types/create', data)

export const remove = data => deleteCall(`/types/${data.id}`)

export const headerCreate = data => postJson('/types/headers/create', data)

export const headerRemove = data => deleteCall(`/types/headers/${data.id}`)

export const edit = data => putJson(`/types/${data.id}`, { ...data, id: undefined })

export const details = data => getJson(`/types/${data.id}`)

export const headerDetails = data => getJson(`/types/headers/${data.id}`)

export const headerEdit = data => putJson(`/types/headers/${data.id}`, { ...data, id: undefined })

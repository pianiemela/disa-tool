import { postJson, deleteCall } from '../utils/utils'

export const create = data => postJson('/skill-levels/create', data)

export const remove = data => deleteCall(`/skill-levels/${data.id}`)

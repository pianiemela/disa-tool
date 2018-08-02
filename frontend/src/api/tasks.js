import { postJson, deleteCall } from '../utils/utils'

export const postTaskResponses = updatedTasks => postJson('/tasks/responses', updatedTasks)

export const addObjective = data => postJson('/tasks/objectives/attach', data)

export const removeObjective = data => postJson('/tasks/objectives/detach', data)

export const addType = data => postJson('/tasks/types/attach', data)

export const removeType = data => postJson('/tasks/types/detach', data)

export const create = data => postJson('/tasks/create', data)

export const remove = data => deleteCall(`/tasks/${data.id}`)

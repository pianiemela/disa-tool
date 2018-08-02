import { getJson, postJson } from '../utils/utils'

export const postTaskResponses = updatedTasks => postJson('/tasks/responses', updatedTasks)

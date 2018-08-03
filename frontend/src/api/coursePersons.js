import { postJson } from '../utils/utils'

export const register = data => postJson('/course-persons/register', data)

export const unregister = data => postJson('/course-persons/unregister', data)

import { postJson, putJson } from '../utils/utils'

export const register = data => postJson('/course-persons/register', data)

export const unregister = data => putJson('/course-persons/unregister', data)

export const changeCourseRole = data => putJson('/course-persons/course-role', data)

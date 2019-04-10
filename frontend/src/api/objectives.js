import { deleteCall, postJson, getJson, putJson } from '../utils/utils'

export const create = data => postJson('/objectives/create', data)

export const remove = data => deleteCall(`/objectives/${data.id}`)

export const taskDetails = data => getJson(`/objectives/tasks/${data.id}`)

export const edit = data => putJson(`/objectives/${data.id}`, { ...data, id: undefined })

export const details = data => getJson(`/objectives/${data.id}`)

export const getByCourseInstance = id => getJson(`/objectives/course/${id}`)

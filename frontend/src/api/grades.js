import { getJson, postJson, deleteCall } from '../utils/utils'

export const getByCourse = data => getJson(`/grades/course/${data.id}`)

export const create = data => postJson('/grades/create', data)

export const remove = data => deleteCall(`/grades/${data.id}`)

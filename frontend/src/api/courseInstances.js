import { getJson, postJson } from '../utils/utils'

export const getData = data => getJson(`/course-instances/data/${data.id}`)

export const create = data => postJson('/course-instances/create', data)

export const getByCourse = courseId => getJson(`/courses/${courseId}`)

export const matrix = data => getJson(`/course-instances/matrix/${data.id}`)

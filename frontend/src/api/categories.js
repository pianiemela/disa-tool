import { getJson, postJson, deleteCall, putJson } from '../utils/utils'

export const getCategoriesForCourse = courseId => getJson(`/categories/${courseId}`)

export const getCourseData = id => getJson('/categories', { courseInstanceId: id })

export const create = data => postJson('/categories/create', data)

export const remove = data => deleteCall(`/categories/${data.id}`)

export const details = data => getJson(`/categories/${data.id}`)

export const edit = data => putJson(`/categories/${data.id}`, { ...data, id: undefined })

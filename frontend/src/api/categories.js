import { getJson, postJson, deleteCall } from '../utils/utils'

export const getCategoriesForCourse = courseId => getJson(`/categories/${courseId}`)

export const getCourseData = id => getJson('/categories', { courseInstanceId: id })

export const create = data => postJson('/categories/create', data)

export const remove = data => deleteCall(`/categories/${data.id}`)

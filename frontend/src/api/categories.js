import { getJson, postJson, putJson } from '../utils/utils'

export const getCategoriesForCourse = courseId => getJson(`/categories/${courseId}`)

export const getCourseData = id => getJson('/categories', { courseInstanceId: id })

import { getJson, postJson, deleteCall, putJson } from '../utils/utils'

export const getByCourse = data => getJson(`/grades/course/${data.id}`)

export const create = data => postJson('/grades/create', data)

export const remove = data => deleteCall(`/grades/${data.id}`)

export const details = data => getJson(`/grades/${data.id}`)

export const edit = data => putJson(`/grades/${data.id}`, { ...data, id: undefined })

export const updateCategoryGrades = categoryGrades =>
  putJson('/grades/category-grades', categoryGrades)

import { getJson, postJson, deleteCall, putJson } from '../utils/utils'

export const getBySelfAssessmentForm = id => getJson(`/category-question/self-assessment-form/${id}`)

export const create = data => postJson('/category-question/create', data)

export const edit = (id, data) => putJson(`/category-question/${id}`, data)

export const remove = id => deleteCall(`/category-question/${id}`)

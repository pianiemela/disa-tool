import { getJson, postJson, putJson, deleteCall } from '../utils/utils'

export const create = data => postJson('/final-grade-question/create', data)

export const getBySelfAssessmentForm = id => getJson(`/final-grade-question/self-assessment-form/${id}`)

export const edit = (id, data) => putJson(`/final-grade-question/${id}`, data)

export const remove = id => deleteCall(`/final-grade-question/${id}`)

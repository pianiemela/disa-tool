import { getJson, postJson, putJson, deleteCall } from '../utils/utils'

export const getBySelfAssessmentForm = id => getJson(`/open-question/self-assessment-form/${id}`)

export const create = data => postJson('/open-question/create', data)

export const edit = (id, data) => putJson(`/open-question/${id}`, data)

export const remove = id => deleteCall(`/open-question/${id}`)

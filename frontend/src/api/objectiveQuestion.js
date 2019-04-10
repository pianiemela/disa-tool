import { getJson, postJson, putJson, deleteCall } from '../utils/utils'

export const getBySelfAssessmentForm = id => getJson(`/objective-question/self-assessment-form/${id}`)

export const create = data => postJson('/objective-question/create', data)

export const edit = (id, data) => putJson(`/objective-question/${id}`, data)

export const remove = id => deleteCall(`/objective-question/${id}`)

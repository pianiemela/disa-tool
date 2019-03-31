import { getJson, putJson, postJson, deleteCall } from '../utils/utils'

export const create = data => postJson('/self-assessment-form/create', data)

export const read = id => getJson(`/self-assessment-form/${id}`)

export const update = (id, data) => putJson(`/self-assessment-form/${id}`, data)

export const remove = id => deleteCall(`/self-assessment-form/${id}`)

export const getByCourse = id => getJson(`/self-assessment-form/course-instance/${id}`)

export const feedback = id => getJson(`/self-assessment-form/${id}/feedback`)

export const individualFeedback = (id, userId) => getJson(`/self-assessment-form/${id}/feedback/${userId}`)

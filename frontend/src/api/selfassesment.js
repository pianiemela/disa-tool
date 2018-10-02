import { getJson, postJson, putJson } from '../utils/utils'

export const createSelfAssesment = data => postJson('/selfassesment/create', data)

export const getSelfAssesments = data => getJson('/selfassesment/', data)

export const updateSelfAssesment = data => putJson(`/selfassesment/update/${data.id}`, data)

export const getSelfAssesment = selfAssesmentId => getJson(`/selfassesment/${selfAssesmentId}`)

export const getSelfAssesmentResponse = assesmentId => getJson(`/assesmentresponse/${assesmentId}`)

export const createSelfAssessmentResponse = data => postJson('/assesmentresponse', data)

export const toggleAssessment = (assessmentId, attribute) => putJson(`/selfassesment/toggle/${assessmentId}/`, attribute)

export const getResponsesBySelfAssesment = data => getJson(`/assesmentresponse/self-assesment/${data.id}`)

export const updateVerificationAndFeedback = assessmentId => putJson(`/assesmentresponse/generate-feedbacks/${assessmentId}`)

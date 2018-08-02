import { getJson, postJson, putJson } from '../utils/utils'

export const createSelfAssesment = data => postJson('/selfassesment/create', data)

export const getSelfAssesments = data => getJson('/selfassesment/', data)

export const updateSelfAssesment = data => putJson(`/selfassesment/update/${data.id}`, data)

export const getSelfAssesment = selfAssesmentId => getJson(`/selfassesment/${selfAssesmentId}`)

export const getSelfAssesmentResponse = assesmentId => getJson(`/assesmentresponse/${assesmentId}`)


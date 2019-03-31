import {
  read,
  update,
  create,
  remove,
  getByCourse,
  feedback,
  individualFeedback
} from '../../../api/selfAssessmentForm'

export const createSelfAssessment = async (data) => {
  const response = await create(data)
  return response.data
}

export const getSelfAssessmentForm = async (id) => {
  const response = await read(id)
  return response.data
}

export const editSelfAssessmentForm = async (id, data) => {
  const response = await update(id, data)
  return response.data
}

export const deleteSelfAssessmentForm = async (id) => {
  const response = await remove(id)
  return response.data
}

export const getSelfAssessmentFormsByCourse = async (id) => {
  const response = await getByCourse(id)
  return response.data
}

export const getFeedbacks = async (id) => {
  const response = await feedback(id)
  return response.data
}

export const getIndividualFeedback = async (id, userId) => {
  const response = await individualFeedback(id, userId)
  return response.data
}

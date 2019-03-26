import { read, update, create } from '../../../api/selfAssessmentForm'

export const createSelfAssessment = async (data) => {
  const response = await create(data)
  return response.data
}

export const getSelfAssessmentForm = async (id) => {
  const response = await read(id)
  return response.data
}

export const editSelfAssessmentForm = async (selfAssessmentForm) => {
  const response = await update(selfAssessmentForm.id, selfAssessmentForm)
  return response.data
}

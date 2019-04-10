import { getBySelfAssessmentForm, create, edit, remove } from '../../../api/objectiveQuestion'

export const getObjectiveQuestions = async (id) => {
  const response = await getBySelfAssessmentForm(id)
  return response.data
}

export const createObjectiveQuestion = async (data) => {
  const response = await create(data)
  return response.data
}

export const deleteObjectiveQuestion = async (id) => {
  const response = await remove(id)
  return response.data
}

export const editObjectiveQuestion = async (id, data) => {
  const response = await edit(id, data)
  return response.data
}

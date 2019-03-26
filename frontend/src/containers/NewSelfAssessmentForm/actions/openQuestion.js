import { getBySelfAssessmentForm, create, remove, edit } from '../../../api/openQuestion'

export const getOpenQuestions = async (id) => {
  const response = await getBySelfAssessmentForm(id)
  return response.data
}

export const createOpenQuestion = async (data) => {
  const response = await create(data)
  return response.data
}

export const deleteOpenQuestion = async (id) => {
  const response = await remove(id)
  return response.data
}

export const editOpenQuestion = async (id, data) => {
  const response = await edit(id, data)
  return response.data
}

import { create, getBySelfAssessmentForm, edit, remove } from '../../../api/finalGradeQuestion'

export const getFinalGradeQuestion = async (id) => {
  const response = await getBySelfAssessmentForm(id)
  return response.data
}

export const createFinalGradeQuestion = async (data) => {
  const response = await create(data)
  return response.data
}

export const deleteFinalGradeQuestion = async (id) => {
  const response = await remove(id)
  return response.data
}

export const editFinalGradeQuestion = async (id, data) => {
  const response = await edit(id, data)
  return response.data
}

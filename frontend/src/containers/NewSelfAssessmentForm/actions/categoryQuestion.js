import { getBySelfAssessmentForm, create, remove, edit } from '../../../api/categoryQuestion'

export const getCategoryQuestions = async (id) => {
  const response = await getBySelfAssessmentForm(id)
  return response.data
}

export const createCategoryQuestion = async (data) => {
  const response = await create(data)
  return response.data
}

export const deleteCategoryQuestion = async (id) => {
  const response = await remove(id)
  return response.data
}

export const editCategoryQuestion = async (id, data) => {
  const response = await edit(id, data)
  return response.data
}

import { create, getByResponse, edit, remove } from '../../../api/categoryResponse'

export const createCategoryResponse = async (data) => {
  const response = await create(data)
  return response.data
}

export const getCategoryResponses = async (id) => {
  const response = await getByResponse(id)
  return response.data
}

export const editCategoryResponse = async (id, data) => {
  const response = await edit(id, data)
  return response.data
}

export const deleteCategoryResponse = async (id) => {
  const response = await remove(id)
  return response.data
}

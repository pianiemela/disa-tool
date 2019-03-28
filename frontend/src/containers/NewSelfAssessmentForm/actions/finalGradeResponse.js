import { create, getByResponse, edit, remove } from '../../../api/finalGradeResponse'

export const createFinalGradeResponse = async (data) => {
  const response = await create(data)
  return response.data
}

export const getFinalGradeResponse = async (id) => {
  const response = await getByResponse(id)
  return response.data
}

export const editFinalGradeResponse = async (id, data) => {
  const response = await edit(id, data)
  return response.data
}

export const deleteFinalGradeResponse = async (id) => {
  const response = await remove(id)
  return response.data
}

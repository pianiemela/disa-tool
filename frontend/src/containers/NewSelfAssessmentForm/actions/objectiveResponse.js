import { create, getByResponse, edit, remove } from '../../../api/objectiveResponse'

export const createObjectiveResponse = async (data) => {
  const response = await create(data)
  return response.data
}

export const getObjectiveResponses = async (id) => {
  const response = await getByResponse(id)
  return response.data
}

export const editObjectiveResponse = async (id, data) => {
  const response = await edit(id, data)
  return response.data
}

export const deleteObjectiveResponse = async (id) => {
  const response = await remove(id)
  return response.data
}

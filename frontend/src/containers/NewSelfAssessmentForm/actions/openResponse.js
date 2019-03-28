import { create, getByResponse, edit, remove } from '../../../api/openResponse'

export const createOpenResponse = async (data) => {
  const response = await create(data)
  return response.data
}

export const getOpenResponses = async (id) => {
  const response = await getByResponse(id)
  return response.data
}

export const editOpenResponse = async (id, data) => {
  const response = await edit(id, data)
  return response.data
}

export const deleteOpenResponse = async (id) => {
  const response = await remove(id)
  return response.data
}

import { create, getMine } from '../../../api/response'

export const createResponse = async (data) => {
  const response = await create(data)
  return response.data
}

export const getResponse = async (id) => {
  const response = await getMine(id)
  return response.data
}

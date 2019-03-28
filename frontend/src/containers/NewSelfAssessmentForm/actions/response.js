import { create } from '../../../api/response'

// eslint-disable-next-line import/prefer-default-export
export const createResponse = async (data) => {
  const response = await create(data)
  return response.data
}

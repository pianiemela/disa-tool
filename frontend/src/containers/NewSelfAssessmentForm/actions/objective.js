import { getByCourseInstance } from '../../../api/objectives'

// eslint-disable-next-line import/prefer-default-export
export const getObjectives = async (id) => {
  const response = await getByCourseInstance(id)
  return response.data
}

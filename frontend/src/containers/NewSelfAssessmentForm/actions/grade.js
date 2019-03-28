import { getByCourse } from '../../../api/grades'

// eslint-disable-next-line import/prefer-default-export
export const getGrades = async (id) => {
  const response = await getByCourse({ id })
  return response.data
}

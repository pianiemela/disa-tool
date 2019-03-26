import { getCategoriesForCourse } from '../../../api/categories'

// eslint-disable-next-line import/prefer-default-export
export const getCategories = async (id) => {
  const response = await getCategoriesForCourse(id)
  return response.data
}

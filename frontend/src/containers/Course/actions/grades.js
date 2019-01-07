import { getByCourse, create, remove, edit } from '../../../api/grades'
import apiPromise from '../../../utils/apiPromise'

export const getGrades = data => apiPromise(getByCourse, data, {
  success: { type: 'GRADE_GET_MANY' }
})

export const addGrade = data => apiPromise(create, data, {
  success: { type: 'GRADE_CREATE' }
})

export const removeGrade = data => apiPromise(remove, data, {
  success: { type: 'GRADE_DELETE' }
})

export const editGrade = data => apiPromise(edit, data, {
  success: { type: 'GRADE_EDIT' }
})

import { getByCourse, create } from '../../../api/grades'
import apiPromise from '../../../utils/apiPromise'

export const getGrades = data => apiPromise(getByCourse, data, { // eslint-disable-line
  success: { type: 'GRADE_GET_MANY' }
})

export const addGrade = data => apiPromise(create, data, {
  success: { type: 'GRADE_CREATE' }
})

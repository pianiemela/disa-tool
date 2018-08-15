import { getByCourse } from '../../../api/grades'
import apiPromise from '../../../utils/apiPromise'

export const getGrades = data => apiPromise(getByCourse, data, { // eslint-disable-line
  success: { type: 'GRADE_GET_MANY' }
})

import * as types from '../../../redux/action_types'
import { getByCourse, create, remove, edit } from '../../../api/grades'
import apiPromise from '../../../utils/apiPromise'

export const getGrades = data => apiPromise(getByCourse, data, {
  success: { type: types.GRADE_GET_MANY }
})

export const addGrade = data => apiPromise(create, data, {
  success: { type: types.GRADE_CREATE }
})

export const removeGrade = data => apiPromise(remove, data, {
  success: { type: types.GRADE_DELETE }
})

export const editGrade = data => apiPromise(edit, data, {
  success: { type: types.GRADE_EDIT }
})

import * as types from '../../../redux/action_types'
import { getData, matrix } from '../../../api/courseInstances'
import apiPromise from '../../../utils/apiPromise'

export const getCourseData = data => apiPromise(getData, data, {
  success: { type: types.COURSE_GET_DATA }
})

export const setEditing = dispatch => (data) => {
  dispatch({
    type: types.COURSE_SET_EDITING,
    data
  })
}

export const getMatrix = data => apiPromise(matrix, data, {
  success: { type: types.COURSE_GET_MATRIX }
})

export const resetCourse = dispatch => () => dispatch({
  type: types.COURSE_RESET
})

import { getData, matrix } from '../../../api/courseInstances'
import apiPromise from '../../../utils/apiPromise'

export const getCourseData = data => apiPromise(getData, data, {
  success: { type: 'COURSE_GET_DATA' }
})

export const setEditing = dispatch => (data) => {
  dispatch({
    type: 'COURSE_SET_EDITING',
    data
  })
}

export const getMatrix = data => apiPromise(matrix, data, {
  success: { type: 'COURSE_GET_MATRIX' }
})

export const resetCourse = dispatch => () => dispatch({
  type: 'COURSE_RESET'
})

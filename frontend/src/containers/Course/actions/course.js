import { getData } from '../../../api/courseInstances'
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

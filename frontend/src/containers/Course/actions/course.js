import { getData } from '../../../api/courseInstances'

export const getCourseData = data => new Promise((resolve) => {
  getData(data).then(response =>
    resolve({
      type: 'COURSE_GET_DATA',
      response: response.data
    }))
})

export const setEditing = dispatch => (data) => {
  dispatch({
    type: 'COURSE_SET_EDITING',
    data
  })
}

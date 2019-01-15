import * as types from '../../../redux/action_types'
import { postJson } from '../../../utils/utils'

const createCourse = data => new Promise((resolve) => {
  postJson('/courses/create', data).then((response) => {
    resolve({
      type: types.COURSE_CREATE,
      response: response.data
    })
  })
})

module.exports = {
  createCourse
}

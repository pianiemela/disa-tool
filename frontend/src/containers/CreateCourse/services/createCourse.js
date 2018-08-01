import { postJson } from '../../../utils/utils'

const createCourse = data => new Promise((resolve) => {
  postJson('/courses/create', data).then((response) => {
    resolve({
      type: 'COURSE_CREATE',
      response: response.data
    })
  })
})

module.exports = {
  createCourse
}

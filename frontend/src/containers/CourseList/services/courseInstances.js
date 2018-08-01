import { postJson } from '../../../utils/utils'

const addInstance = data => new Promise((resolve) => {
  postJson('/course-instances/create', data).then((response) => {
    resolve({
      type: 'COURSE_INSTANCE_CREATE',
      response: response.data
    })
  })
})

module.exports = {
  addInstance
}

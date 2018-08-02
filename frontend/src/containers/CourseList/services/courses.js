import { getJson } from '../../../utils/utils'

const getCourses = () => new Promise((resolve) => {
  getJson('/courses').then((response) => {
    resolve({
      type: 'COURSELIST_GET_COURSES',
      response: response.data
    })
  })
})

module.exports = {
  getCourses
}

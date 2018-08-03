import { register, unregister } from '../../../api/coursePersons'

export const registerToCourse = data => new Promise((resolve) => {
  register(data).then(response => resolve({
    type: 'COURSEPERSON_REGISTER',
    response: response.data
  }))
})

export const unregisterFromCourse = data => new Promise((resolve) => {
  unregister(data).then(response => resolve({
    type: 'COURSEPERSON_UNREGISTER',
    response: response.data
  }))
})

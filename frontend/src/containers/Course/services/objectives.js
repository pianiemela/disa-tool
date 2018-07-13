import { deleteCall } from '../../../utils/utils'

export const addObjective = (data) => {
  const response = {
    message: '<addCObjectiveSuccess>',
    data: {
      ...data,
      id: 15
    }
  }
  const action = {
    type: 'OBJECTIVE_CREATE',
    response
  }
  return new Promise((resolve) => {
    setTimeout(resolve, 100, action)
  })
}

export const removeObjective = data => new Promise((resolve) => {
  deleteCall(`/objectives/${data.id}`).then(response => resolve({
    type: 'OBJECTIVE_DELETE',
    response: response.data
  }))
})

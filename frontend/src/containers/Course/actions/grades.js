import { getByCourse, create, remove, edit } from '../../../api/grades'
import apiPromise from '../../../utils/apiPromise'

export const getGrades = data => apiPromise(getByCourse, data, { // eslint-disable-line
  success: { type: 'GRADE_GET_MANY' }
})

export const addGrade = data => apiPromise(create, data, {
  success: { type: 'GRADE_CREATE' }
})

export const removeGrade = data => apiPromise(remove, data, {
  success: { type: 'GRADE_DELETE' }
})

export const editGrade = data => apiPromise(edit, data, {
  success: { type: 'GRADE_EDIT' }
})

export const moveGrade = dispatch => (drag, hover) => {
  edit({ id: drag.id, order: hover.order })
  edit({ id: hover.id, order: drag.order })
  dispatch({
    type: 'GRADE_MOVE',
    drag,
    hover
  })
}

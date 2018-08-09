import { updateCoursePersonRole } from '../../../api/courses'

export const updateCoursePersonRoleAction = coursePersons => async (dispatch) => {
  dispatch({
    type: 'COURSE_INSTANCE_UPDATE_PERSON_ROLE_ATTEMPT',
    payload: coursePersons
  })
  try {
    const { data } = await updateCoursePersonRole(coursePersons)
    dispatch({
      type: 'COURSE_INSTANCE_UPDATE_PERSON_ROLE_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'COURSE_INSTANCE_UPDATE_PERSON_ROLE_FAILURE',
      payload: e.response
    })
  }
}

export default updateCoursePersonRoleAction

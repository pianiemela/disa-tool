import { getJson, postJson, putJson } from '../utils/utils'

export const getUsersCourses = () => getJson('/courses/user')

export const getAllSelfAssesments = () => getJson('/courses/user')

export const getCategoriesForCourse = courseId => getJson(`/categories/${courseId}`)

export const getUser = () => getJson('/persons/user')

export const createSelfAssesment = data => postJson('/selfassesment/create', data)

export const getSelfAssesments = data => getJson('/selfassesment/', data)

export const getCourseInstanceData = courseId => getJson(`/courses/instance/${courseId}`)

export const updateSelfAssesment = data => putJson(`/selfassesment/update/${data.id}`, data)

export const getSelfAssesment = selfAssesmentId => getJson(`/selfassesment/${selfAssesmentId}`)

export const getCourseInstance = id => getJson(`/course-instances/${id}`)

export const getCourseData = id => getJson('/categories', { courseInstanceId: id })

export const getSelfAssesmentResponse = assesmentId => getJson(`/assesmentresponse/${assesmentId}`)

export const postTaskResponses = updatedTasks => postJson('/tasks/responses', updatedTasks)


export const getAssesmentResponseAction = assesmentId => async (dispatch) => {
  dispatch({
    type: 'GET_ASSESMENT_RESPONSE_ATTEMPT',
    payload: ''
  })
  const { data } = await getSelfAssesmentResponse(assesmentId)
  try {
    dispatch({
      type: 'GET_ASSESMENT_RESPONSE_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'GET_ASSESMENT_RESPONSE_FAILURE',
      payload: e.response
    })
  }
}

export const getUserAction = () => async (dispatch) => {
  dispatch({
    type: 'USER_GET_ATTEMPT',
    payload: {}
  })
  try {
    const { data } = await getUser()
    dispatch({
      type: 'USER_GET_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'USER_GET_FAILURE',
      payload: e.response
    })
  }
}

export const getAllCoursesAction = () => async (dispatch) => {
  dispatch({
    type: 'GET_COURSES_ATTEMPT',
    payload: ''
  })
  try {
    const { data } = await getCourses()
    dispatch({
      type: 'GET_COURSES_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'GET_COURSES_FAILURE',
      payload: e.response
    })
  }
}

export const getUserCoursesAction = () => async (dispatch) => {
  dispatch({
    type: 'USER_GET_COURSES_ATTEMPT',
    payload: ''
  })
  try {
    const { data } = await getUsersCourses()
    dispatch({
      type: 'USER_GET_COURSES_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'USER_GET_COURSES_FAILURE',
      payload: e.response
    })
  }
}

export const getSelfAssesmentAction = selfAssesmentId => async (dispatch) => {
  dispatch({
    type: 'GET_SELF_ASSESMENT_ATTEMPT',
    payload: ''
  })
  try {
    const { data } = await getSelfAssesment(selfAssesmentId)
    dispatch({
      type: 'GET_SELF_ASSESMENT_SUCCESS',
      payload: data
    })
  } catch (error) {
    dispatch({
      type: 'GET_SELF_ASSESMENT_FAILURE',
      payload: error.response
    })
  }
}

export const createForm = data => async (dispatch) => {
  dispatch({
    type: 'CREATE_SELF_ASSESMENT_ATTEMPT',
    payload: ''
  })

  try {
    const res = await createSelfAssesment(data)
    dispatch({
      type: 'CREATE_SELF_ASSESMENT_SUCCESS',
      payload: res
    })
  } catch (error) {
    dispatch({
      type: 'CREATE_SELF_ASSESMENT_FAILURE',
      payload: error

    })
  }
}

export const getUserSelfAssesments = user => async (dispatch) => {
  dispatch({
    type: 'GET_ALL_USER_SELFASSESMENTS_ATTEMPT',
    payload: ''
  })

  try {
    const res = await getSelfAssesments(user)
    dispatch({
      type: 'GET_ALL_USER_SELFASSESMENTS_SUCCESS',
      payload: res.data
    })
  } catch (error) {
    dispatch({
      type: 'GET_ALL_USER_SELFASSESMENTS_FALURE',
      payload: error
    })
  }
}

export const updateSelfAssesmentAction = data => async (dispatch) => {
  try {
    const res = await updateSelfAssesment(data)
    dispatch({
      type: 'SELF_ASSESMENT_UPDATE_SUCCESS',
      payload: res.data
    })
  } catch (error) {
    dispatch({
      type: 'SELF_ASSESMENT_UPDATE_FAILURE',
      payload: error
    })
  }
}

export const getCourseInstanceDataAction = courseId => async (dispatch) => {
  dispatch({
    type: 'COURSES_GET_INSTANCE_DATA_ATTEMPT',
    payload: ''
  })
  try {
    const { data } = await getCourseInstanceData(courseId)
    dispatch({
      type: 'COURSES_GET_INSTANCE_DATA_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'COURSES_GET_INSTANCE_DATA_FAILURE',
      payload: e.response
    })
  }
}

export const logoutAction = (dispatch) => {
  localStorage.removeItem('token')
  dispatch({
    type: 'USER_LOGOUT',
    payload: {}
  })
}

import { getJson, postJson, putJson } from '../utils/utils'

export const getUsersCourses = () => getJson('/courses/user')

export const getCourses = () => getJson('/courses')

export const getInstancesOfCourse = courseId => getJson(`/courses/${courseId}`)

export const getCategoriesForCourse = courseId => getJson(`/categories/${courseId}`)

export const getUser = () => getJson('/persons/user')

export const createSelfAssesment = data => postJson('/selfassesment/create', data)

export const getSelfAssesments = data => getJson('/selfassesment/', data)

export const getCourseInstanceData = courseId => getJson(`/courses/instance/${courseId}`)

export const updateSelfAssesment = data => putJson(`/selfassesment/update/${data.id}`, data)

export const getUserAction = () => async (dispatch) => {
  dispatch({
    type: 'USER_GET_ATTEMPT',
    payload: ''
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

export const toggleTextField = id => (dispatch) => {
  dispatch({
    type: 'TOGGLE_TEXT_FIELD',
    payload: id
  })
}

export const initNewFormAaction = data => (dispatch) => {
  dispatch({
    type: 'INIT_NEW_FORM',
    payload: data
  })
}

export const toggleUp = id => (dispatch) => {
  dispatch({
    type: 'TOGGLE_UP',
    payload: id
  })
}

export const toggleDown = id => (dispatch) => {
  dispatch({
    type: 'TOGGLE_DOWN',
    payload: id
  })
}

export const addOpenQuestion = questionData => (dispatch) => {
  dispatch({
    type: 'ADD_OPEN_QUESTION',
    payload: questionData
  })
}

export const removeOpenQuestion = id => (dispatch) => {
  dispatch({
    type: 'REMOVE_OPEN_QUESTION',
    payload: id
  })
}

export const changeTextField = (type, value) => (dispatch) => {
  dispatch({
    type: 'CHANGE_TEXT_FIELD',
    payload: { type, value }

  })
}

export const toggleFormPartAction = (id, type) => (dispatch) => {
  dispatch({
    type: 'TOGGLE_FORM_PART',
    payload: { id, type }
  })
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

export const editFormAction = data => (dispatch) => {
  dispatch({
    type: 'INIT_EDIT_FORM',
    payload: data
  })
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

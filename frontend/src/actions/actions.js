import { getUsersCourses, getCourses, getCourseInstanceData, toggleCourseInstanceActivity, updateCoursePersonRole } from '../api/courses'
import { getSelfAssesment, createSelfAssesment, getSelfAssesments, updateSelfAssesment, getSelfAssesmentResponse, createSelfAssessmentResponse, toggleAssessment } from '../api/selfassesment'
import { getUser } from '../api/persons'
import { postTaskResponses } from '../api/tasks'
import { login } from '../api/login'
import { saveToken, removeToken } from '../utils/utils'


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

export const createForm = assessmentData => async (dispatch) => {
  dispatch({
    type: 'CREATE_SELF_ASSESMENT_ATTEMPT',
    payload: ''
  })

  try {
    const { data } = await createSelfAssesment(assessmentData)
    dispatch({
      type: 'CREATE_SELF_ASSESMENT_SUCCESS',
      payload: data
    })
  } catch (error) {
    dispatch({
      type: 'CREATE_SELF_ASSESMENT_FAILURE',
      payload: error.response

    })
  }
}

export const getUserSelfAssesments = user => async (dispatch) => {
  dispatch({
    type: 'GET_ALL_USER_SELFASSESMENTS_ATTEMPT',
    payload: ''
  })

  try {
    const { data } = await getSelfAssesments(user)
    dispatch({
      type: 'GET_ALL_USER_SELFASSESMENTS_SUCCESS',
      payload: data
    })
  } catch (error) {
    dispatch({
      type: 'GET_ALL_USER_SELFASSESMENTS_FALURE',
      payload: error.response
    })
  }
}

export const updateSelfAssesmentAction = assessmentData => async (dispatch) => {
  try {
    const { data } = await updateSelfAssesment(assessmentData)
    dispatch({
      type: 'SELF_ASSESMENT_UPDATE_SUCCESS',
      payload: data
    })
  } catch (error) {
    dispatch({
      type: 'SELF_ASSESMENT_UPDATE_FAILURE',
      payload: error.response
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

export const toggleCourseActivityAction = courseId => async (dispatch) => {
  dispatch({
    type: 'COURSE_INSTANCE_TOGGLE_ACTIVITY_ATTEMPT',
    payload: courseId
  })
  try {
    const { data } = await toggleCourseInstanceActivity(courseId)
    dispatch({
      type: 'COURSE_INSTANCE_TOGGLE_ACTIVITY_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'COURSE_INSTANCE_TOGGLE_ACTIVITY_FAILURE',
      payload: e.response
    })
  }
}

export const toggleAssessmentAction = (assessmentId, attribute) => async (dispatch) => {
  dispatch({
    type: 'SELF_ASSESSMENT_TOGGLE_ATTEMPT',
    payload: assessmentId
  })
  try {
    const { data } = await toggleAssessment(assessmentId, { attribute })
    dispatch({
      type: 'SELF_ASSESSMENT_TOGGLE_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'SELF_ASSESSMENT_TOGGLE_FAILURE',
      payload: e.response
    })
  }
}

export const createSelfAssessmentResponseAction = responseData => async (dispatch) => {
  dispatch({
    type: 'ASSESMENT_RESPONSE_CREATE_ATTEMPT',
    payload: ''
  })
  try {
    const { data } = await createSelfAssessmentResponse(responseData)
    dispatch({
      type: 'ASSESMENT_RESPONSE_CREATE_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'ASSESMENT_RESPONSE_CREATE_FAILURE',
      payload: e.response
    })
  }
}

export const loginAction = userData => async (dispatch) => {
  dispatch({
    type: 'USER_LOGIN_ATTEMPT',
    payload: userData
  })
  try {
    const { data } = await login(userData)
    saveToken(data.token)
    dispatch({
      type: 'USER_LOGIN_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'USER_LOGIN_FAILURE',
      payload: e.response
    })
  }
}

export const logoutAction = (dispatch) => {
  removeToken()
  dispatch({
    type: 'USER_LOGOUT',
    payload: {}
  })
}

export const postTaskResponseActions = tasks => async (dispatch) => {
  dispatch({
    type: 'COURSE_INSTANCE_POST_TASK_RESPONSES_ATTEMPT',
    payload: tasks
  })
  try {
    const { data } = await postTaskResponses(tasks)
    dispatch({
      type: 'COURSE_INSTANCE_POST_TASK_RESPONSES_SUCCESS',
      payload: data
    })
  } catch (e) {
    dispatch({
      type: 'COURSE_INSTANCE_POST_TASK_RESPONSES_FAILURE',
      payload: e.response
    })
  }
}

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

import {
  getUsersCourses,
  getCourses,
  getCourseInstanceData,
  toggleCourseInstanceActivity,
  getCourseTasks
} from '../api/courses'
import {
  getSelfAssesment,
  createSelfAssesment,
  getSelfAssesments,
  updateSelfAssesment,
  getSelfAssesmentResponse,
  createSelfAssessmentResponse,
  toggleAssessment,
  setAssessmentStatus
} from '../api/selfassesment'
import { getUser, updateCoursePersons } from '../api/persons'
import { deleteCoursePerson } from '../api/coursePersons'
import { postTaskResponses } from '../api/tasks'
import { updateCategoryGrades } from '../api/grades'
import * as types from '../redux/action_types'

export const getAssesmentResponseAction = assesmentId => async (dispatch) => {
  dispatch({
    type: types.GET_ASSESMENT_RESPONSE_ATTEMPT,
    payload: ''
  })
  try {
    const { data } = await getSelfAssesmentResponse(assesmentId)
    dispatch({
      type: types.GET_ASSESMENT_RESPONSE_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.GET_ASSESMENT_RESPONSE_FAILURE,
      payload: e.response
    })
  }
}

export const getUserAction = () => async (dispatch) => {
  dispatch({
    type: types.USER_GET_ATTEMPT,
    payload: {}
  })
  try {
    const { data } = await getUser()
    dispatch({
      type: types.USER_GET_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.USER_GET_FAILURE,
      payload: e.response
    })
  }
}

export const getAllCoursesAction = () => async (dispatch) => {
  dispatch({
    type: types.GET_COURSES_ATTEMPT,
    payload: ''
  })
  try {
    const { data } = await getCourses()
    dispatch({
      type: types.GET_COURSES_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.GET_COURSES_FAILURE,
      payload: e.response
    })
  }
}

export const getUserCoursesAction = () => async (dispatch) => {
  dispatch({
    type: types.USER_GET_COURSES_ATTEMPT,
    payload: ''
  })
  try {
    const { data } = await getUsersCourses()
    dispatch({
      type: types.USER_GET_COURSES_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.USER_GET_COURSES_FAILURE,
      payload: e.response
    })
  }
}

export const getSelfAssesmentAction = selfAssesmentId => async (dispatch) => {
  dispatch({
    type: types.GET_SELF_ASSESMENT_ATTEMPT,
    payload: ''
  })
  try {
    const { data } = await getSelfAssesment(selfAssesmentId)
    dispatch({
      type: types.GET_SELF_ASSESMENT_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: types.GET_SELF_ASSESMENT_FAILURE,
      payload: error.response
    })
  }
}

export const createForm = assessmentData => async (dispatch) => {
  dispatch({
    type: types.CREATE_SELF_ASSESMENT_ATTEMPT,
    payload: ''
  })

  try {
    const { data } = await createSelfAssesment(assessmentData)
    dispatch({
      type: types.CREATE_SELF_ASSESMENT_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: types.CREATE_SELF_ASSESMENT_FAILURE,
      payload: error.response
    })
  }
}

export const getUserSelfAssesments = user => async (dispatch) => {
  dispatch({
    type: types.GET_ALL_USER_SELFASSESMENTS_ATTEMPT,
    payload: ''
  })

  try {
    const { data } = await getSelfAssesments(user)
    dispatch({
      type: types.GET_ALL_USER_SELFASSESMENTS_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: types.GET_ALL_USER_SELFASSESMENTS_FALURE,
      payload: error.response
    })
  }
}

export const updateSelfAssesmentAction = assessmentData => async (dispatch) => {
  try {
    const { data } = await updateSelfAssesment(assessmentData)
    dispatch({
      type: types.SELF_ASSESMENT_UPDATE_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: types.SELF_ASSESMENT_UPDATE_FAILURE,
      payload: error.response
    })
  }
}

export const getCourseInstanceDataAction = courseId => async (dispatch) => {
  dispatch({
    type: types.COURSES_GET_INSTANCE_DATA_ATTEMPT,
    payload: ''
  })
  try {
    const { data } = await getCourseInstanceData(courseId)
    dispatch({
      type: types.COURSES_GET_INSTANCE_DATA_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.COURSES_GET_INSTANCE_DATA_FAILURE,
      payload: e.response
    })
  }
}

export const getCourseInstanceTasksAction = instance => async (dispatch) => {
  dispatch({
    type: types.COURSES_GET_INSTANCE_TASKS_ATTEMPT,
    payload: ''
  })
  try {
    const { data } = await getCourseTasks(instance)
    dispatch({
      type: types.COURSES_GET_INSTANCE_TASKS_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.COURSES_GET_INSTANCE_TASKS_FAILURE,
      payload: e.response
    })
  }
}

export const resetCourseInstanceAction = () => async (dispatch) => {
  dispatch({
    type: types.COURSE_INSTANCE_RESET,
    payload: ''
  })
}

export const toggleCourseActivityAction = courseId => async (dispatch) => {
  dispatch({
    type: types.COURSE_INSTANCE_TOGGLE_ACTIVITY_ATTEMPT,
    payload: courseId
  })
  try {
    const { data } = await toggleCourseInstanceActivity(courseId)
    dispatch({
      type: types.COURSE_INSTANCE_TOGGLE_ACTIVITY_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.COURSE_INSTANCE_TOGGLE_ACTIVITY_FAILURE,
      payload: e.response
    })
  }
}

export const toggleAssessmentAction = (assessmentId, attribute) => async (dispatch) => {
  dispatch({
    type: types.SELF_ASSESSMENT_TOGGLE_ATTEMPT,
    payload: assessmentId
  })
  try {
    const { data } = await toggleAssessment(assessmentId, { attribute })
    dispatch({
      type: types.SELF_ASSESSMENT_TOGGLE_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.SELF_ASSESSMENT_TOGGLE_FAILURE,
      payload: e.response
    })
  }
}

export const setAssessmentStatusAction = (assessmentId, attributes) => async (dispatch) => {
  dispatch({
    type: types.SELF_ASSESSMENT_STATUS_ATTEMPT,
    payload: assessmentId
  })
  try {
    const { data } = await setAssessmentStatus(assessmentId, { attributes })
    dispatch({
      type: types.SELF_ASSESSMENT_STATUS_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.SELF_ASSESSMENT_STATUS_FAILURE,
      payload: e.response
    })
  }
}

export const createSelfAssessmentResponseAction = responseData => async (dispatch) => {
  dispatch({
    type: types.ASSESMENT_RESPONSE_CREATE_ATTEMPT,
    payload: ''
  })
  try {
    const { data } = await createSelfAssessmentResponse(responseData)
    dispatch({
      type: types.ASSESMENT_RESPONSE_CREATE_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.ASSESMENT_RESPONSE_CREATE_FAILURE,
      payload: e.response
    })
  }
}

export const logoutAction = message => (dispatch) => {
  dispatch({
    type: types.USER_LOGOUT,
    payload: { message }
  })
}

export const postTaskResponseActions = tasks => async (dispatch) => {
  dispatch({
    type: types.COURSE_INSTANCE_POST_TASK_RESPONSES_ATTEMPT,
    payload: tasks
  })
  try {
    const { data } = await postTaskResponses(tasks)
    dispatch({
      type: types.COURSE_INSTANCE_POST_TASK_RESPONSES_SUCCESS,
      payload: data
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: types.COURSE_INSTANCE_POST_TASK_RESPONSES_FAILURE,
      payload: e.response
    })
  }
}

export const updateCoursePersonsAction = coursePersons => async (dispatch) => {
  dispatch({
    type: types.COURSE_INSTANCE_UPDATE_PERSON_ATTEMPT,
    payload: coursePersons
  })
  try {
    const { data } = await updateCoursePersons(coursePersons)
    dispatch({
      type: types.COURSE_INSTANCE_UPDATE_PERSON_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.COURSE_INSTANCE_UPDATE_PERSON_FAILURE,
      payload: e.response
    })
  }
}

export const deleteCoursePersonAction = coursePerson => async (dispatch) => {
  dispatch({
    type: types.COURSE_INSTANCE_DELETE_PERSON_ATTEMPT,
    payload: coursePerson
  })
  try {
    const { data } = await deleteCoursePerson(coursePerson)
    dispatch({
      type: types.COURSE_INSTANCE_DELETE_PERSON_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.COURSE_INSTANCE_DELETE_PERSON_FAILURE,
      payload: e.response
    })
  }
}

export const resetErrorAction = () => async (dispatch) => {
  dispatch({
    type: types.RESET_ERROR,
    payload: ''
  })
}

export const updateCategoryGradesAction = categoryGrades => async (dispatch) => {
  dispatch({
    type: types.GRADE_UPDATE_CATEGORY_GRADES_ATTEMPT,
    payload: categoryGrades
  })
  try {
    const { data } = await updateCategoryGrades(categoryGrades)
    dispatch({
      type: types.GRADE_UPDATE_CATEGORY_GRADES_SUCCESS,
      payload: data
    })
  } catch (e) {
    dispatch({
      type: types.GRADE_UPDATE_CATEGORY_GRADES_FAILURE,
      payload: e.response
    })
  }
}

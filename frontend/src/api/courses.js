import { getJson, postJson, putJson } from '../utils/utils'

export const getUsersCourses = () => getJson('/courses/user')

// export const getAllSelfAssesments = () => getJson('/courses/user')

export const getCourses = () => getJson('/courses')

export const getInstancesOfCourse = courseId => getJson(`/courses/${courseId}`)

export const getCourseInstanceData = courseId => getJson(`/courses/instance/${courseId}`)

export const getCourseInstance = id => getJson(`/course-instances/${id}`)

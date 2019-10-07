import { getJson, putJson, postJson } from '../utils/utils'

export const getUsersCourses = () => getJson('/courses/user')

// export const getAllSelfAssesments = () => getJson('/courses/user')

export const getCourses = () => getJson('/courses')

export const getInstancesOfCourse = courseId => getJson(`/courses/${courseId}`)

export const getCourseInstanceData = courseId => getJson(`/courses/instance/${courseId}`)

export const getCourseTasks = instance => postJson(`/courses/instance/${instance.id}/tasks`, { instance })

export const getCourseInstance = id => getJson(`/course-instances/${id}`)

export const toggleCourseInstanceActivity = id => putJson(`/courses/instance/${id}/toggle`, null)

export const editCourse = data => putJson(`/courses/details/${data.id}`, data)

export const getCourse = data => getJson(`/courses/details/${data.id}`)
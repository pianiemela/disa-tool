import {
  getCourseData,
  hardCodedCategories,
  hardCodedTypes,
  hardCodedTasks,
  hardCodedLevels,
  hardCodedCourse
} from '../../../../containers/Course/services/course'
import { testService } from '../../../testUtils'

testService({
  function: getCourseData,
  type: 'COURSE_GET_DATA',
  data: {
    courseId: 1
  },
  mockResponse: {
    data: {
      course: {
        ...hardCodedCourse,
        id: 1
      },
      tasks: hardCodedTasks,
      categories: hardCodedCategories,
      types: hardCodedTypes,
      levels: hardCodedLevels
    },
    message: '<getDataForCourseSuccess>'
  }
})

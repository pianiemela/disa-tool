import { getCourseData, getMatrix } from '../../../../containers/Course/actions/course'
import { testService } from '../../../testUtils'

testService({
  func: getCourseData,
  type: {
    success: 'COURSE_GET_DATA'
  },
  data: {
    id: 1
  },
  apiRoute: '/course-instances/data/1'
})

testService({
  func: getMatrix,
  type: {
    success: 'COURSE_GET_MATRIX'
  },
  data: {
    id: 1
  },
  apiRoute: '/course-instances/matrix/1'
})

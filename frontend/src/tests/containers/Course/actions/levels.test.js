import { addLevel, removeLevel } from '../../../../containers/Course/actions/levels'
import { testService } from '../../../testUtils'

testService({
  func: addLevel,
  type: {
    success: 'LEVEL_CREATE'
  },
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    swe_name: 'dååt',
    course_instance_id: 2
  },
  apiRoute: '/skill-levels/create',
  apiMethod: 'post'
})

testService({
  func: removeLevel,
  type: {
    success: 'LEVEL_DELETE'
  },
  data: {
    id: 6
  },
  apiRoute: '/skill-levels/6',
  apiMethod: 'delete'
})

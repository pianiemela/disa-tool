import { addLevel, removeLevel, editLevel } from '../../../../containers/Course/actions/levels'
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

testService({
  func: editLevel,
  type: {
    success: 'LEVEL_EDIT'
  },
  data: {
    id: 6,
    eng_name: 'doot',
    fin_name: 'dööt',
    swe_name: 'dååt'
  },
  apiRoute: '/skill-levels/6',
  apiMethod: 'put'
})

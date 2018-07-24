import { addLevel, removeLevel } from '../../../../containers/Course/services/levels'
import { testService } from '../../../testUtils'

testService({
  func: addLevel,
  type: 'LEVEL_CREATE',
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    swe_name: 'dååt',
    course_instance_id: 2
  },
  mockResponse: {
    message: 'dummy message',
    created: {
      name: 'dööt',
      id: 7
    }
  },
  apiRoute: '/skill-levels/create',
  apiMethod: 'post'
})

testService({
  func: removeLevel,
  type: 'LEVEL_DELETE',
  data: {
    id: 6
  },
  mockResponse: {
    message: 'dummy message',
    deleted: {
      id: 6,
      tasks: [
        {
          id: 4,
          objective_ids: [12, 13, 15]
        },
        {
          id: 5,
          objective_ids: [12]
        }
      ]
    }
  },
  apiRoute: '/skill-levels/6',
  apiMethod: 'delete'
})

import { addCategory, removeCategory } from '../../../../containers/Course/services/categories'
import { testService } from '../../../testUtils'

testService({
  func: addCategory,
  type: 'CATEGORY_CREATE',
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
  apiRoute: '/categories/create',
  apiMethod: 'post'
})

testService({
  func: removeCategory,
  type: 'CATEGORY_DELETE',
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
  apiRoute: '/categories/6',
  apiMethod: 'delete'
})

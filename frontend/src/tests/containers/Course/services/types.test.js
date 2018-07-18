import { addType, removeType } from '../../../../containers/Course/services/types'
import { testService } from '../../../testUtils'

testService({
  func: addType,
  type: 'TYPE_CREATE',
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    swe_name: 'dååt',
    courseId: 1
  },
  mockResponse: {
    message: '<addTypeSuccess>',
    data: {
      name: 'dööt',
      id: 10
    }
  },
  apiMethod: 'post',
  apiRoute: '/types/create'
})

testService({
  func: removeType,
  type: 'TYPE_DELETE',
  data: {
    id: 15
  },
  mockResponse: {
    message: '<removeTypeSuccess>',
    data: {
      id: 15,
      task_ids: [
        12,
        3
      ]
    }
  },
  apiMethod: 'delete',
  apiRoute: '/types/15'
})

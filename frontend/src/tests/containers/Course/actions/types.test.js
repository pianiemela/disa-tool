import { addType, removeType, addHeader, removeHeader } from '../../../../containers/Course/actions/types'
import { testService } from '../../../testUtils'

testService({
  func: addType,
  type: {
    success: 'TYPE_CREATE'
  },
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    swe_name: 'dååt',
    courseId: 1
  },
  apiMethod: 'post',
  apiRoute: '/types/create'
})

testService({
  func: removeType,
  type: {
    success: 'TYPE_DELETE'
  },
  data: {
    id: 15
  },
  apiMethod: 'delete',
  apiRoute: '/types/15'
})

testService({
  func: addHeader,
  type: {
    success: 'TYPE_HEADER_CREATE'
  },
  apiRoute: '/types/headers/create',
  apiMethod: 'post'
})

testService({
  func: removeHeader,
  type: {
    success: 'TYPE_HEADER_DELETE'
  },
  data: {
    id: 16
  },
  apiRoute: '/types/headers/16',
  apiMethod: 'delete'
})

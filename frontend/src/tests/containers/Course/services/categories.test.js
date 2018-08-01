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
  apiRoute: '/categories/create',
  apiMethod: 'post'
})

testService({
  func: removeCategory,
  type: 'CATEGORY_DELETE',
  data: {
    id: 6
  },
  apiRoute: '/categories/6',
  apiMethod: 'delete'
})

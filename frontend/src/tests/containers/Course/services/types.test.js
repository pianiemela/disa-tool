import { addType, removeType } from '../../../../containers/Course/services/types'
import { testService } from '../../../testUtils'

testService({
  function: addType,
  type: 'TYPE_CREATE',
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    sve_name: 'dååt',
    courseId: 1
  },
  mockResponse: {
    message: '<addTypeSuccess>',
    data: {
      eng_name: 'doot',
      fin_name: 'dööt',
      sve_name: 'dååt',
      courseId: 1,
      id: 10
    }
  }
})

testService({
  function: removeType,
  type: 'TYPE_DELETE',
  data: {
    id: 15
  },
  mockResponse: {
    message: '<removeTypeSuccess>',
    data: {
      id: 15
    }
  }
})

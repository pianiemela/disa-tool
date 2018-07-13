import { addObjective, removeObjective } from '../../../../containers/Course/services/objectives'
import { testService } from '../../../testUtils'

testService({
  func: addObjective,
  type: 'OBJECTIVE_CREATE',
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    sve_name: 'dååt',
    skillLevelId: 3,
    categoryId: 7,
    courseId: 1
  },
  mockResponse: {
    message: '<addCObjectiveSuccess>',
    data: {
      eng_name: 'doot',
      fin_name: 'dööt',
      sve_name: 'dååt',
      skillLevelId: 3,
      categoryId: 7,
      courseId: 1,
      id: 15
    }
  },
  apiRoute: '/api/objectives/create',
  apiMethod: 'post'
})

testService({
  func: removeObjective,
  type: 'OBJECTIVE_DELETE',
  data: {
    id: 1
  },
  mockResponse: {
    message: '<removeObjectiveSuccess>',
    deleted: 1
  },
  apiRoute: '/api/objectives/1',
  apiMethod: 'delete'
})

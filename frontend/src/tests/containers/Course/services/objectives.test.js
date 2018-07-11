import { addObjective, removeObjective } from '../../../../containers/Course/services/objectives'
import { testService } from '../../../testUtils'

testService({
  function: addObjective,
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
  }
})

testService({
  function: removeObjective,
  type: 'OBJECTIVE_DELETE',
  data: {
    id: 1
  },
  mockResponse: {
    message: '<removeObjectiveSuccess>',
    data: {
      id: 1
    }
  }
})

import { addObjective, removeObjective } from '../../../../containers/Course/services/objectives'
import { testService } from '../../../testUtils'

testService({
  func: addObjective,
  type: 'OBJECTIVE_CREATE',
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    swe_name: 'dååt',
    skill_level_id: 3,
    category_id: 7,
    course_instance_id: 1
  },
  mockResponse: {
    message: '<addObjectiveSuccess>',
    created: {
      id: 15,
      name: 'dööt',
      skill_level_id: 3,
      category_id: 7
    }
  },
  apiRoute: '/api/objectives/create',
  apiMethod: 'post'
})

testService({
  func: removeObjective,
  type: 'OBJECTIVE_DELETE',
  data: {
    id: 15
  },
  mockResponse: {
    message: '<removeObjectiveSuccess>',
    deleted: {
      id: 15,
      skill_level_id: 3,
      category_id: 7
    }
  },
  apiRoute: '/api/objectives/15',
  apiMethod: 'delete'
})

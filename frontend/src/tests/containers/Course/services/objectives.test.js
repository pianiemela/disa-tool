import { addObjective, removeObjective } from '../../../../containers/Course/services/objectives'
import { testService } from '../../../testUtils'

testService({
  func: addObjective,
  type: 'OBJECTIVE_CREATE',
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    sve_name: 'dååt',
    skill_level_id: 3,
    category_id: 7,
    course_instance_id: 1
  },
  mockResponse: {
    message: '<addObjectiveSuccess>'
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

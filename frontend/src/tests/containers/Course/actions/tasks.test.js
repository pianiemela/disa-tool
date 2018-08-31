import {
  addTask,
  removeTask,
  addObjectiveToTask,
  removeObjectiveFromTask,
  addTypeToTask,
  removeTypeFromTask
} from '../../../../containers/Course/actions/tasks'
import { testService } from '../../../testUtils'

testService({
  func: addTask,
  type: {
    success: 'TASK_CREATE'
  },
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    swe_name: 'dååt',
    course_instance_id: 1
  },
  apiRoute: '/tasks/create',
  apiMethod: 'post'
})

testService({
  func: removeTask,
  type: {
    success: 'TASK_DELETE'
  },
  data: {
    id: 3
  },
  apiRoute: '/tasks/3',
  apiMethod: 'delete'
})

testService({
  func: addObjectiveToTask,
  type: {
    success: 'TASK_ATTACH_OBJECTIVE'
  },
  data: {
    task_id: 7,
    objective_id: 4
  },
  apiRoute: '/tasks/objectives/attach',
  apiMethod: 'post'
})

testService({
  func: removeObjectiveFromTask,
  type: {
    success: 'TASK_DETACH_OBJECTIVE'
  },
  data: {
    task_id: 11,
    objective_id: 23
  },
  apiRoute: '/tasks/objectives/detach',
  apiMethod: 'post'
})

testService({
  func: addTypeToTask,
  type: {
    success: 'TASK_ATTACH_TYPE'
  },
  data: {
    type_id: 7,
    task_id: 4
  },
  apiRoute: '/tasks/types/attach',
  apiMethod: 'post'
})

testService({
  func: removeTypeFromTask,
  type: {
    success: 'TASK_DETACH_TYPE'
  },
  data: {
    type_id: 11,
    task_id: 23
  },
  apiRoute: '/tasks/types/detach',
  apiMethod: 'post'
})

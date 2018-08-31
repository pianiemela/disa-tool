import {
  addTask,
  removeTask,
  addObjectiveToTask,
  removeObjectiveFromTask,
  addTypeToTask,
  removeTypeFromTask,
  editTask,
  editTaskObjectives
} from '../../../../containers/Course/actions/tasks'
import { testService } from '../../../testUtils'

testService({
  func: addTask,
  type: {
    success: 'TASK_CREATE'
  },
  data: {
    course_instance_id: 1,
    eng_name: 'doot',
    fin_name: 'dööt',
    swe_name: 'dååt',
    info: 'info',
    eng_description: 'ed',
    fin_description: 'fd',
    swe_description: 'sd'
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

testService({
  func: editTask,
  type: {
    success: 'TASK_EDIT'
  },
  data: {
    id: 3,
    eng_name: 'doot',
    fin_name: 'dööt',
    swe_name: 'dååt',
    info: 'info',
    eng_description: 'ed',
    fin_description: 'fd',
    swe_description: 'sd'
  },
  apiRoute: '/tasks/3',
  apiMethod: 'put'
})

testService({
  func: editTaskObjectives,
  type: {
    success: 'TASK_EDIT_OBJECTIVE_MULTIPLIERS'
  },
  data: {
    task_id: 3,
    objectives: []
  },
  apiRoute: '/tasks/objectives/edit',
  apiMethod: 'post'
})

import {
  addTask,
  removeTask,
  addObjectiveToTask,
  removeObjectiveFromTask,
  addTypeToTask,
  removeTypeFromTask
} from '../../../../containers/Course/services/tasks'
import { testService } from '../../../testUtils'

testService({
  func: addTask,
  type: 'TASK_CREATE',
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    swe_name: 'dååt',
    course_instance_id: 1
  },
  mockResponse: {
    message: '<addTaskSuccess>',
    created: {
      name: 'dööt',
      course_instance_id: 1,
      id: 2
    }
  },
  apiRoute: '/tasks/create',
  apiMethod: 'post'
})

testService({
  func: removeTask,
  type: 'TASK_DELETE',
  data: {
    id: 3
  },
  mockResponse: {
    message: '<removeTaskSuccess>',
    deleted: {
      id: 3
    }
  },
  apiRoute: '/tasks/3',
  apiMethod: 'delete'
})

testService({
  func: addObjectiveToTask,
  type: 'TASK_ATTACH_OBJECTIVE',
  data: {
    task_id: 7,
    objective_id: 4
  },
  mockResponse: {
    message: '<addObjectiveToTaskSuccess>',
    created: {
      task_id: 7,
      objective_id: 4
    }
  },
  apiRoute: '/tasks/objectives/attach',
  apiMethod: 'post'
})

testService({
  func: removeObjectiveFromTask,
  type: 'TASK_DETACH_OBJECTIVE',
  data: {
    task_id: 11,
    objective_id: 23
  },
  mockResponse: {
    message: '<removeObjectiveFromTaskSuccess>',
    deleted: {
      task_id: 11,
      objective_id: 23
    }
  },
  apiRoute: '/tasks/objectives/detach',
  apiMethod: 'post'
})

/* testService({
  func: addTypeToTask,
  type: 'TASK_ADD_TYPE',
  data: {
    typeId: 7,
    taskId: 4
  },
  mockResponse: {
    message: '<addTypeToTaskSuccess>',
    data: {
      typeId: 7,
      taskId: 4
    }
  }
})

testService({
  func: removeTypeFromTask,
  type: 'TASK_REMOVE_TYPE',
  data: {
    typeId: 11,
    taskId: 23
  },
  mockResponse: {
    message: '<removeTypeFromTaskSuccess>',
    data: {
      typeId: 11,
      taskId: 23
    }
  }
}) */

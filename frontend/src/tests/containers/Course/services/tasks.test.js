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
  function: addTask,
  type: 'TASK_CREATE',
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    sve_name: 'dååt',
    courseId: 1
  },
  mockResponse: {
    message: '<addTaskSuccess>',
    data: {
      eng_name: 'doot',
      fin_name: 'dööt',
      sve_name: 'dååt',
      courseId: 1,
      id: 2
    }
  }
})

testService({
  function: removeTask,
  type: 'TASK_DELETE',
  data: {
    id: 3
  },
  mockResponse: {
    message: '<removeTaskSuccess>',
    data: {
      id: 3
    }
  }
})

testService({
  function: addObjectiveToTask,
  type: 'TASK_ADD_OBJECTIVE',
  data: {
    taskId: 7,
    objectiveId: 4
  },
  mockResponse: {
    message: '<addObjectiveToTaskSuccess>',
    data: {
      taskId: 7,
      objectiveId: 4
    }
  }
})

testService({
  function: removeObjectiveFromTask,
  type: 'TASK_REMOVE_OBJECTIVE',
  data: {
    taskId: 11,
    objectiveId: 23
  },
  mockResponse: {
    message: '<removeObjectiveFromTaskSuccess>',
    data: {
      taskId: 11,
      objectiveId: 23
    }
  }
})

testService({
  function: addTypeToTask,
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
  function: removeTypeFromTask,
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
})

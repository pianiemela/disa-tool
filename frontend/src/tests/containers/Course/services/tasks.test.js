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

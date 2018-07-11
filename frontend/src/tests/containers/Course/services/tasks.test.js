import {
  addTask,
  removeTask,
  addObjectiveToTask,
  removeObjectiveFromTask,
  addTypeToTask,
  removeTypeFromTask
} from '../../../../containers/Course/services/tasks'
import asyncAction from '../../../../utils/asyncAction'

describe('addTask function', () => {
  const mockResponse = {
    message: '<addTaskSuccess>',
    data: {
      eng_name: 'doot',
      fin_name: 'dööt',
      sve_name: 'dååt',
      courseId: 1,
      id: 2
    }
  }
  let data

  beforeEach(() => {
    data = {
      eng_name: 'doot',
      fin_name: 'dööt',
      sve_name: 'dååt',
      courseId: 1
    }
  })

  it('returns a promise', () => {
    expect(typeof addTask(data).then).toEqual('function')
  })

  describe('dispatch', () => {
    let dispatch
    let withDispatch

    beforeEach(() => {
      dispatch = jest.fn()
      withDispatch = asyncAction(addTask, dispatch)
    })

    it('is called with correct action.', async () => {
      await withDispatch(data)
      expect(dispatch).toHaveBeenCalledWith({
        type: 'TASK_CREATE',
        response: mockResponse
      })
    })
  })
})

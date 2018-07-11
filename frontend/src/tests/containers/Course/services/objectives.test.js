import { addObjective, removeObjective } from '../../../../containers/Course/services/objectives'
import asyncAction from '../../../../utils/asyncAction'

describe('addObjective function', () => {
  const mockResponse = {
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
  let data

  beforeEach(() => {
    data = {
      eng_name: 'doot',
      fin_name: 'dööt',
      sve_name: 'dååt',
      skillLevelId: 3,
      categoryId: 7,
      courseId: 1
    }
  })

  it('returns a promise', () => {
    expect(typeof addObjective(data).then).toEqual('function')
  })

  describe('dispatch', () => {
    let dispatch
    let withDispatch

    beforeEach(() => {
      dispatch = jest.fn()
      withDispatch = asyncAction(addObjective, dispatch)
    })

    it('is called with correct action.', async () => {
      await withDispatch(data)
      expect(dispatch).toHaveBeenCalledWith({
        type: 'OBJECTIVE_CREATE',
        response: mockResponse
      })
    })
  })
})

describe('removeObjective function', () => {
  const mockResponse = {
    message: '<removeObjectiveSuccess>',
    data: {
      id: 1
    }
  }
  let data

  beforeEach(() => {
    data = {
      id: 1
    }
  })

  it('returns a promise', () => {
    expect(typeof removeObjective(data).then).toEqual('function')
  })

  describe('dispatch', () => {
    let dispatch
    let withDispatch

    beforeEach(() => {
      dispatch = jest.fn()
      withDispatch = asyncAction(removeObjective, dispatch)
    })

    it('is called with correct action.', async () => {
      await withDispatch(data)
      expect(dispatch).toHaveBeenCalledWith({
        type: 'OBJECTIVE_DELETE',
        response: mockResponse
      })
    })
  })
})

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import asyncAction from '../utils/asyncAction'
import { defaultSuccess, defaultFailure } from '../utils/apiPromise'

import { BASE_PATH } from '../utils/utils'

export const findText = (text, wrapper) => {
  let found = 0
  if (wrapper.text().includes(text)) found += 1
  wrapper.children().forEach((child) => {
    found += findText(text, child)
  })
  return found
}

const buildMockApi = (mockMethod, mockPath, mockStatus, mockResponse) => {
  const apiMock = new MockAdapter(axios)
  let route
  switch (mockMethod) {
    case 'get':
      route = apiMock.onGet(mockPath)
      break
    case 'post':
      route = apiMock.onPost(mockPath)
      break
    case 'put':
      route = apiMock.onPut(mockPath)
      break
    case 'delete':
      route = apiMock.onDelete(mockPath)
      break
    default:
      throw new Error('apiMethod was invalid, no api mock created.')
  }
  route.replyOnce(mockStatus, mockResponse)
}

const mapType = (input) => {
  switch (typeof input) {
    case 'string':
      return {
        success: input,
        failure: input
      }
    case 'object':
      return {
        success: input.success || defaultSuccess,
        failure: input.failure || defaultFailure
      }
    default:
      return {
        success: defaultSuccess,
        failure: defaultFailure
      }
  }
}

/**
 * @param {Object} options {
 *  func,
 *  data,
 *  mockResponse,
 *  type,
 *  apiRoute,
 *  apiMethod (default 'get'),
 *  mockStatus (default 200)
 * }
 */
export const testService = (options) => {
  const {
    func,
    data = {},
    mockResponse = {},
    apiRoute,
    apiMethod = 'get',
    mockStatus = 200
  } = options
  const type = mapType(options.type)

  if (apiRoute === undefined) {
    throw new Error('apiRoute was undefined.')
  }
  const path = `${BASE_PATH}${apiRoute}`

  describe(`${func.name} func`, () => {
    let dispatch
    let withDispatch

    it('returns a promise', () => {
      expect(typeof func(data).then).toEqual('function')
    })

    it('handles errors', () => {
      expect(typeof func(data).catch).toEqual('function')
    })

    describe('when succeeding', () => {
      beforeEach(() => {
        buildMockApi(apiMethod, path, mockStatus, mockResponse)
        dispatch = jest.fn()
        withDispatch = asyncAction(func, dispatch)
      })

      it('dispatch is called with correct action.', async () => {
        await withDispatch(data)
        expect(dispatch).toHaveBeenCalledWith({
          type: type.success,
          response: mockResponse
        })
      })
    })

    describe('when failing', () => {
      beforeEach(() => {
        buildMockApi(apiMethod, path, 500, { testFail: true })
        dispatch = jest.fn()
        withDispatch = asyncAction(func, dispatch)
      })

      it('dispatch is called with correct action.', async () => {
        await withDispatch(data)
        expect(dispatch).toHaveBeenCalledWith({
          type: type.failure,
          response: { testFail: true }
        })
      })
    })
  })
}

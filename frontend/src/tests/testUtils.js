import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import asyncAction from '../utils/asyncAction'

import { BASE_PATH } from '../utils/utils'

export const findText = (text, wrapper) => {
  let found = 0
  if (wrapper.text().includes(text)) found += 1
  wrapper.children().forEach((child) => {
    found += findText(text, child)
  })
  return found
}

/**
 * @param {*} options {
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
  const { func, data = {}, mockResponse = {}, type, apiRoute, apiMethod = 'get', mockStatus = 200 } = options
  if (apiRoute === undefined) {
    throw new Error('apiRoute was undefined.')
  }
  const path = `${BASE_PATH}${apiRoute}`

  describe(`${func.name} func`, () => {
    let dispatch
    let withDispatch
    let apiMock

    beforeAll(() => {
      apiMock = new MockAdapter(axios)
      let route
      switch (apiMethod) {
        case 'get':
          route = apiMock.onGet(path)
          break
        case 'post':
          route = apiMock.onPost(path)
          break
        case 'put':
          route = apiMock.onPut(path)
          break
        case 'delete':
          route = apiMock.onDelete(path)
          break
        default:
          throw new Error('apiMethod was invalid, no api mock created.')
      }
      route.reply(mockStatus, mockResponse)
      dispatch = jest.fn()
      withDispatch = asyncAction(func, dispatch)
    })

    it('returns a promise', () => {
      expect(typeof func(data).then).toEqual('function')
    })

    describe('dispatch', () => {
      it('is called with correct action.', async () => {
        await withDispatch(data)
        expect(dispatch).toHaveBeenCalledWith({
          type,
          response: mockResponse
        })
      })
    })
  })
}

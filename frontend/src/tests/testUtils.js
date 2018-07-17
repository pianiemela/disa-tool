import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import asyncAction from '../utils/asyncAction'

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
  const { func, data, mockResponse, type, apiRoute, apiMethod = 'get', mockStatus = 200 } = options
  if (apiRoute === undefined) {
    console.warn('apiRoute was undefined. All routes will be considered valid and pass tests.')
  }

  describe(`${func.name} func`, () => {
    it('returns a promise', () => {
      expect(typeof func(data).then).toEqual('function')
    })

    describe('dispatch', () => {
      let dispatch
      let withDispatch
      let apiMock

      beforeEach(() => {
        apiMock = new MockAdapter(axios)
        let route
        switch (apiMethod) {
          case 'get':
            route = apiMock.onGet(apiRoute)
            break
          case 'post':
            route = apiMock.onPost(apiRoute)
            break
          case 'put':
            route = apiMock.onPut(apiRoute)
            break
          case 'delete':
            route = apiMock.onDelete(apiRoute)
            break
          default:
            console.warn('apiMethod was invalid, no api mock created.')
        }
        route.reply(mockStatus, mockResponse)
        dispatch = jest.fn()
        withDispatch = asyncAction(func, dispatch)
      })

      afterEach(() => {
        apiMock.reset()
      })

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

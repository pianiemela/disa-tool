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
 *  apiMethod (default get),
 *  mockStatus (default 200)
 * }
 */
export const testService = (options) => {
  const { func, data, mockResponse, type, apiRoute, apiMethod = 'get', mockStatus = 200 } = options
  const apiMock = new MockAdapter(axios)
  switch (apiMethod) {
    case 'get':
      apiMock.onGet(apiRoute).reply(mockStatus, mockResponse)
      break
    case 'post':
      apiMock.onPost(apiRoute).reply(mockStatus, mockResponse)
      break
    case 'put':
      apiMock.onPut(apiRoute).reply(mockStatus, mockResponse)
      break
    case 'delete':
      apiMock.onDelete(apiRoute).reply(mockStatus, mockResponse)
      break
    default:
      console.warn('apiMethod was invalid, no api mock created.')
  }

  describe(`${func.name} func`, () => {
    it('returns a promise', () => {
      expect(typeof func(data).then).toEqual('function')
    })

    describe('dispatch', () => {
      let dispatch
      let withDispatch

      beforeEach(() => {
        dispatch = jest.fn()
        withDispatch = asyncAction(func, dispatch)
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

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
 * 
 * @param {*} options {
 *  function,
 *  data,
 *  mockResponse,
 *  type
 * }
 */
export const testService = (options) => {
  describe(`${options.function.name} function`, () => {
    it('returns a promise', () => {
      expect(typeof options.function(options.data).then).toEqual('function')
    })
  
    describe('dispatch', () => {
      let dispatch
      let withDispatch
  
      beforeEach(() => {
        dispatch = jest.fn()
        withDispatch = asyncAction(options.function, dispatch)
      })
  
      it('is called with correct action.', async () => {
        await withDispatch(options.data)
        expect(dispatch).toHaveBeenCalledWith({
          type: options.type,
          response: options.mockResponse
        })
      })
    })
  })
}

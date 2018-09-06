import apiPromise, { defaultSuccess, defaultFailure } from '../../utils/apiPromise'

const testError = 'apiCall test error'
const testData = { test: true }

const responseError = (data) => {
  const error = new Error(testError)
  error.response = {
    data: { success: false, data }
  }
  return error
}

const apiCall = success => data => new Promise((resolve, reject) => (
  success ? resolve({
    data: { success: true, data }
  }) : reject(responseError(data))
))

describe('apiPromise utility', () => {
  let action

  describe('when succeeding', () => {
    beforeEach(() => {
      action = data => apiPromise(apiCall(true), data, {})
    })

    it('Resolves to default action type.', () => {
      expect(action(testData)).resolves.toEqual({
        type: defaultSuccess,
        response: {
          success: true,
          data: testData
        }
      })
    })

    describe('When success action is defined', () => {
      beforeEach(() => {
        action = data => apiPromise(apiCall(true), data, {
          success: { type: 'TEST_SUCCESS', extra_field: 'extra' }
        })
      })

      it('Resolves to defined action type.', () => {
        expect(action(testData)).resolves.toMatchObject({
          type: 'TEST_SUCCESS'
        })
      })

      it('Resolves to action with extra fields intact.', () => {
        expect(action(testData)).resolves.toMatchObject({
          extra_field: 'extra'
        })
      })
    })
  })

  describe('when failing', () => {
    beforeEach(() => {
      action = data => apiPromise(apiCall(false), data, {})
    })

    it('Resolves to default action type.', () => {
      expect(action(testData)).resolves.toEqual({
        type: defaultFailure,
        response: {
          success: false,
          data: testData
        }
      })
    })

    describe('When failure action is defined', () => {
      beforeEach(() => {
        action = data => apiPromise(apiCall(false), data, {
          failure: { type: 'TEST_FAILURE', extra_field: 'extra' }
        })
      })

      it('Resolves to defined action type.', () => {
        expect(action(testData)).resolves.toMatchObject({
          type: 'TEST_FAILURE'
        })
      })

      it('Resolves to action with extra fields intact.', () => {
        expect(action(testData)).resolves.toMatchObject({
          extra_field: 'extra'
        })
      })
    })
  })
})

const success = (resolve, action) => response => resolve({
  ...action,
  response: response.data
})

const failure = (resolve, action) => error => resolve({
  ...action,
  response: error.response.data
})

const successToast = resolve => success(resolve, { type: 'APIPROMISE_GENERIC_SUCCESS' })

const failureToast = resolve => failure(resolve, { type: 'APIPROMISE_GENERIC_FAILURE' })

const apiPromise = (apiCall, param, actions = {}) => new Promise((resolve) => {
  apiCall(param)
    .then(actions.success ? success(resolve, actions.success) : successToast(resolve))
    .catch(actions.failure ? failure(resolve, actions.failure) : failureToast(resolve))
})

export default apiPromise

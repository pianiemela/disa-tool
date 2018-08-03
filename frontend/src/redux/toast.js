import { toast } from 'react-toastify'

const INITIAL_STATE = {}

const options = {
  error: {
    type: toast.TYPE.ERROR
  },
  message: {
    type: toast.TYPE.SUCCESS
  }
}

const toastReducer = (state = INITIAL_STATE, action) => {
  if (action.response) {
    if (action.response.error) {
      return {
        message: action.response.error,
        options: options.error
      }
    } else if (action.response.message) {
      return {
        message: action.response.message,
        options: options.message
      }
    }
  }
  return state
}

export default toastReducer

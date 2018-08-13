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
  if (action.payload) {
    if (action.payload.data && action.payload.data.error) {
      return {
        message: action.payload.data.error,
        options: options.error
      }
    } else if (action.payload.message) {
      return {
        toast: true,
        message: action.payload.message,
        options: options.message
      }
    }
  }
  return state
}

export default toastReducer

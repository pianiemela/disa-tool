import { checkResponseErrors } from '../utils/reduxHelpers/validation'
const INITIAL_STATE = {
  responseErrors: {
    qModErrors:
      { grade: [], responseText: [] },
    finalGErrors:
      { grade: [], responseText: [] },
    openQErrors:
      { grade: [], responseText: [] }
  },
  softErrors: false,
  formErrors: false

}

export const validationReducer = (state = INITIAL_STATE, action) => {
  console.log(action.type);

  switch (action.type) {
    case 'VALIDATE_RESPONSE': {
      const {
        grade,
        fGrade,
        openQErrors,
        responseTextMax,
        finalResponseMax,
        responseTextMin,
        finalResponseMin }
        = checkResponseErrors(action.payload)
      const softErrors = responseTextMin.length > 0 || finalResponseMin.length > 0 ? true : false
      if (grade.length > 0
        || fGrade.length > 0
        || openQErrors.length > 0
        || responseTextMax.length > 0
        || finalResponseMax.length > 0) {
        return ({
          responseErrors:
          {
            ...state.responseErrors,
            openQErrors: {
              ...state.responseErrors.openQErrors,
              responseText: openQErrors
            },
            finalGErrors: {
              ...state.responseErrors.finalGErrors,
              grade: fGrade,
              responseText: finalResponseMax
            },
            qModErrors: {
              ...state.responseErrors.qModErrors,
              grade,
              responseText: responseTextMax
            }
          },
          softErrors: false,
          formErrors: true
        })
      }
      return { ...INITIAL_STATE, softErrors }
    }
    case 'CLEAR_RESPONSE_ERROR': {
      const newE = { ...state.responseErrors }
      const { type, errorType, id, objective } = action.payload
      if (objective) {
        const toReplace = newE[type][errorType].find(e => e.id === id)
        if (toReplace) { delete toReplace.errors[objective] }
        newE[type][errorType] = newE[type][errorType].map(e => (e.id === id ? toReplace : e))
      } else {
        if (type === 'qModErrors' || 'openQErrors') {
          newE[type][errorType] = newE[type][errorType].filter(error => error.id !== id)
        }

        if (type === 'finalGErrors') {
          newE[type][errorType] = []
        }
      }
      return { ...state, responseErrors: newE }
    }
    case 'CLEAR_VALIDATION': {
      return INITIAL_STATE
    }
    case 'CLOSE_MODAL': {
      return { ...state, softErrors: false }
    }
    default:
      return state
  }
}

export default validationReducer

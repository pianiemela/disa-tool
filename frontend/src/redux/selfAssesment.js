import initForm from '../utils/reduxHelpers/selfAssesment'

const INITIAL_STATE = {
  createForm: {},
  userSelfAssesments: []
}

const getToggleProps = (id, state) => {
  const toggleData = {}
  const structure = { ...state.createForm.structure }
  toggleData.questionModules = structure.questionModules
  toggleData.a = toggleData.questionModules.findIndex(x => x.id === id)
  toggleData.b = toggleData.questionModules[toggleData.a]
  return toggleData
}

export const selfAssesmentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INIT_NEW_FORM': {
      const data = initForm(action.payload)
      return { ...state, createForm: data }
    }

    case 'INIT_EDIT_FORM': {
      const { data } = action.payload
      const formInfo = []
      formInfo.push(
        data.eng_name,
        data.fin_name,
        data.swe_name,
        data.eng_description,
        data.fin_description,
        data.swe_description
      )
      data.formInfo = formInfo
      return { ...state, createForm: data }
    }

    case 'TOGGLE_TEXT_FIELD': {
      const id = action.payload
      return {
        ...state,
        createForm: {
          ...state.createForm,
          structure: {
            ...state.createForm.structure,
            questionModules: [
              ...state.createForm.structure.questionModules.map(o =>
                (o.id !== id ? o : { ...o, textFieldOn: !o.textFieldOn }))
            ]
          }
        }
      }
    }

    case 'TOGGLE_DOWN': {
      const { a, b, questionModules } = getToggleProps(action.payload, state)

      if (a < questionModules.length - 1) {
        questionModules[a] = questionModules[a + 1]
        questionModules[a + 1] = b
      }
      return {
        ...state,
        createForm: {
          ...state.createForm,
          structure: {
            ...state.createForm.structure,
            questionModules
          }
        }
      }
    }

    case 'TOGGLE_UP': {
      const { a, b, questionModules } = getToggleProps(action.payload, state)

      if (a > 0) {
        questionModules[a] = questionModules[a - 1]
        questionModules[a - 1] = b
      }
      return {
        ...state,
        createForm: {
          ...state.createForm,
          structure: {
            ...state.createForm.structure,
            questionModules
          }
        }
      }
    }

    case 'ADD_OPEN_QUESTION': {
      const questionData = action.payload
      const { openQuestions, finalGrade } = state.createForm.structure
      let data = null
      if (openQuestions.length > 0) {
        data = {
          id: openQuestions[openQuestions.length - 1].id + 1,
          name: questionData
        }
      } else {
        const id = parseInt(((finalGrade.id) + 1).toString(), 10)
        data = {
          id,
          name: questionData
        }
      }

      return {
        ...state,
        createForm: {
          ...state.createForm,
          structure: {
            ...state.createForm.structure,
            openQuestions: [
              ...state.createForm.structure.openQuestions.concat(data)
            ]
          }
        }
      }
    }

    case 'REMOVE_OPEN_QUESTION': {
      const id = action.payload
      return {
        ...state,
        createForm: {
          ...state.createForm,
          structure: {
            ...state.createForm.structure,
            openQuestions:
              state.createForm.structure.openQuestions.filter(oQ => oQ.id !== id)
          }
        }
      }
    }

    case 'CHANGE_TEXT_FIELD': {
      const { values } = action.payload
      const ids = Object.keys(values)
      return {
        ...state,
        createForm: {
          ...state.createForm,
          structure: {
            ...state.createForm.structure,
            formInfo: state.createForm.structure.formInfo.map(inst =>
              (ids.includes(inst.id.toString()) ? { ...inst, value: values[inst.id] } : inst))
          }
        }
      }
    }

    case 'TOGGLE_FORM_PART': {
      const { id } = action.payload
      const { finalGrade } = state.createForm.structure

      if (id === finalGrade.id) {
        return {
          ...state,
          createForm: {
            ...state.createForm,
            structure: {
              ...state.createForm.structure,
              finalGrade: {
                ...state.createForm.structure.finalGrade,
                includedInAssesment: !state.createForm.structure.finalGrade.includedInAssesment
              }
            }
          }
        }
      }
      return {
        ...state,
        createForm: {
          ...state.createForm,
          structure: {
            ...state.createForm.structure,
            questionModules: state.createForm.structure.questionModules.map(qm =>
              (qm.id === id ? { ...qm, includedInAssesment: !qm.includedInAssesment } : qm))
          }
        }
      }
    }

    case 'CREATE_SELF_ASSESMENT_SUCCESS': {
      const selfAssesments = state.userSelfAssesments.concat(action.payload.data.data)
      return { ...state, createForm: [], userSelfAssesments: selfAssesments }
    }

    case 'CHANGE_HEADER': {
      const { changedHeaders, headerType } = action.payload
      const ids = Object.keys(changedHeaders)
      if (headerType) {
        return {
          ...state,
          createForm: {
            ...state.createForm,
            structure: {
              ...state.createForm.structure,
              headers: {
                ...state.createForm.structure.headers,
                [headerType]: state.createForm.structure.headers[headerType].map(secHeader =>
                  (ids.includes(secHeader.id.toString()) ?
                    { ...secHeader, value: changedHeaders[secHeader.id] } : secHeader))
              }
            }
          }
        }
      }

      return {
        ...state,
        createForm: {
          ...state.createForm,
          structure: {
            ...state.createForm.structure,
            finalGrade: {
              ...state.createForm.structure.finalGrade,
              headers: state.createForm.structure.finalGrade.headers.map(fg =>
                (ids.includes(fg.id.toString()) ? { ...fg, value: changedHeaders[fg.id] } : fg))
            }
          }
        }
      }
    }

    case 'GET_ALL_USER_SELFASSESMENTS_SUCCESS': {
      return { ...state, userSelfAssesments: action.payload.data }
    }
    case 'SELF_ASSESMENT_UPDATE_SUCCESS': {
      const { data } = action.payload
      return {
        ...state,
        userSelfAssesments: state.userSelfAssesments.map(s => (s.id === data.id ? data : s))
      }
    }

    default:
      return state
  }
}

export default selfAssesmentReducer

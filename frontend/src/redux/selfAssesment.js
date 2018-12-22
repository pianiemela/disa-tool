import { initForm, initResponseForm, respond } from '../utils/reduxHelpers/selfAssesment'

const INITIAL_STATE = {
  createForm: {},
  userSelfAssesments: [],
  assesmentResponse: {},
  unsavedFormChanges: false
}

const langName = `${localStorage.getItem('lang')}_name`
const langInstructions = `${localStorage.getItem('lang')}_instructions`

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
      return { ...state, createForm: data, assesmentResponse: {} }
    }

    case 'GET_SELF_ASSESMENT_SUCCESS': {
      const { data } = action.payload
      return { ...state, createForm: data, assesmentResponse: {} }
    }

    case 'GET_ASSESMENT_RESPONSE_SUCCESS': {
      const { data } = action.payload
      /*
      if the asssesment response is empty,
      we have a user who hasnt answered to the assessment yet, so we'll create it
      by using the assessment course data we have in the createForm object in reducer

      Otherwise we'll just store the response data we have in the api request to
      reducer field assesmentResponse
      */
      if (data.response) {
        data.response.existingAnswer = true
        return { ...state, assesmentResponse: data.response }
      }
      const created = initResponseForm(state.createForm)
      return { ...state, assesmentResponse: created }
    }

    case 'OPEN_QUESTION_RESPONSE': {
      const { id, value } = action.payload
      return {
        ...state,
        assesmentResponse: {
          ...state.assesmentResponse,
          openQuestionResponses:
            state.assesmentResponse.openQuestionResponses.map(oQ =>
              (oQ.id === id ? { ...oQ, responseText: value } : oQ))
        }
      }
    }

    case 'GRADE_CATEGORY_RESPONSE': {
      return respond(state, action.payload, 'grade')
    }

    case 'GRADE_OBJECTIVE_RESPONSE': {
      return respond(state, action.payload, 'grade')
    }

    case 'TEXTFIELD_RESPONSE': {
      return respond(state, action.payload, 'responseText')
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
        },
        unsavedFormChanges: true
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
        },
        unsavedFormChanges: true
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
        },
        unsavedFormChanges: true
      }
    }

    case 'ADD_OPEN_QUESTION': {
      const { fin_name, eng_name, swe_name } = action.payload //eslint-disable-line
      const { openQuestions } = state.createForm.structure
      let data = null
      data = {
        id: openQuestions.incrementId,
        fin_name,
        eng_name,
        swe_name,
        name: action.payload[langName]
      }

      return {
        ...state,
        createForm: {
          ...state.createForm,
          structure: {
            ...state.createForm.structure,
            openQuestions: {
              ...state.createForm.structure.openQuestions,
              incrementId: state.createForm.structure.openQuestions.incrementId + 1,
              questions: [...state.createForm.structure.openQuestions.questions.concat(data)
              ]
            }
          }
        },
        unsavedFormChanges: true
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
            openQuestions: {
              ...state.createForm.structure.openQuestions,
              questions: state.createForm.structure.openQuestions.questions.filter(oQ => oQ.id !== id) //eslint-disable-line
            }
          }
        },
        unsavedFormChanges: true
      }
    }

    case 'CHANGE_TEXT_FIELD': {
      const { values, type } = action.payload
      const ids = Object.keys(values)
      if (ids.length === 0) {
        return state
      }

      const toChange = (state.createForm.structure.formInfo.find(h => (h.type === (type === 'instructions' ? langInstructions : langName))))
      let value = null
      if (ids.includes(toChange.id.toString())) {
        value = type === 'instructions' ? { ...state.createForm[type], value: values[toChange.id] } : values[toChange.id]
      } else {
        value = state.createForm[type]
      }

      return {
        ...state,
        createForm: {
          ...state.createForm,
          structure: {
            ...state.createForm.structure,
            formInfo: state.createForm.structure.formInfo.map(inst =>
              (ids.includes(inst.id.toString()) ? { ...inst, value: values[inst.id] } : inst))
          },
          [type]: value
        },
        unsavedFormChanges: true
      }
    }

    case 'TOGGLE_FORM_PART': {
      const { id, type } = action.payload
      const { finalGrade } = state.createForm.structure
      if (type === 'objective') {
        const copy = { ...state.createForm }
        const { structure } = copy

        structure.questionModules = structure.questionModules.map(qm =>
          ({
            ...qm,
            objectives: qm.objectives.map(qmo =>
              (qmo.id === id ? { ...qmo, includedInAssesment: !qmo.includedInAssesment } : qmo))
          }))
        return { ...state, createForm: copy }
      }

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
          },
          unsavedFormChanges: true
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
        },
        unsavedFormChanges: true
      }
    }

    case 'CREATE_SELF_ASSESMENT_SUCCESS': {
      const selfAssesments = state.userSelfAssesments.concat(action.payload.data)
      return { ...state, createForm: [], userSelfAssesments: selfAssesments }
    }

    case 'CHANGE_HEADER': {
      const { changedHeaders, headerType } = action.payload
      const ids = Object.keys(changedHeaders)
      if (ids.length === 0) {
        return state
      }

      if (headerType) {
        let name = state.createForm.structure.headers[headerType].find(h => h.type === langName)
        name = ids.includes(name.id.toString()) ? changedHeaders[name.id] : name.value

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
              },
              finalGrade:
              {
                ...state.createForm.structure.finalGrade,
                header: name
              }
            }
          },
          unsavedFormChanges: true
        }
      }

      let name = state.createForm.structure.finalGrade.headers.find(h => h.type === langName)
      name = ids.includes(name.id.toString()) ? changedHeaders[name.id] : name.value

      return {
        ...state,
        createForm: {
          ...state.createForm,
          structure: {
            ...state.createForm.structure,
            finalGrade: {
              ...state.createForm.structure.finalGrade,
              headers: state.createForm.structure.finalGrade.headers.map(fg =>
                (ids.includes(fg.id.toString()) ? { ...fg, value: changedHeaders[fg.id] } : fg)),
              name
            }
          }
        },
        unsavedFormChanges: true
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
    case 'CLEAR_ASSESSMENT': {
      return { ...state, createForm: {}, assesmentResponse: {}, unsavedFormChanges: false }
    }

    default:
      return state
  }
}

export default selfAssesmentReducer

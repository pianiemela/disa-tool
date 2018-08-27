import { initForm, initResponseForm, respond } from '../utils/reduxHelpers/selfAssesment'

const INITIAL_STATE = {
  createForm: {},
  userSelfAssesments: [],
  assesmentResponse: {}
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
      return { ...state, createForm: data, assesmentResponse: {} }
    }

    case 'GET_SELF_ASSESMENT_SUCCESS': {
      const { data } = action.payload
      return { ...state, createForm: data, assesmentResponse: {} }
    }

    case 'GET_ASSESMENT_RESPONSE_SUCCESS': {
      const { data } = action.payload
      /*
      if the assesment response is empty,
      we have a user who hasnt answered to the assesment yet, so we'll create it
      by using the assesment course data we have in the createForm object in reducer

      Otherwise we'll just store the response data we have in the api request to
      reducer field assesmentResponse
      */
      if (data.response) {
        /* We have to take in consideration that the amount of open questions can change
        // so it'd be wise to some sort of checking and adding
        // Regarding the changed amount of categories... well have to see about that
        // as of now; dont create the assesment and expect it to contain all updated info
         about your course, that youve put in after you created the assesment
        */
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
      const { openQuestions } = state.createForm.structure
      let data = null
      data = {
        id: openQuestions.incrementId,
        name: questionData
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
            openQuestions: {
              ...state.createForm.structure.openQuestions,
              questions: state.createForm.structure.openQuestions.questions.filter(oQ => oQ.id !== id)
            }
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
      const selfAssesments = state.userSelfAssesments.concat(action.payload.data)
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

const INITIAL_STATE = {
  createForm: {},
  userSelfAssesments: []
}


const initForm = (payload) => {
  const { courseData, type, courseInfo } = payload
  const data = {}
  data.course_instance_id = courseInfo.id
  data.displayCoursename = courseInfo.name
  data.formInfo = []
  const { formInfo } = data

  formInfo.push(
    { id: 1, displayName: 'English name', value: 'Ruottia', type: 'eng_name' },
    { id: 2, displayName: 'Finnish name', value: 'Soomea', type: 'fin_name' },
    { id: 3, displayName: 'Swedish name', value: 'Enkalnti', type: 'swe_name' }
  )
  formInfo.push(
    { id: 4, displayName: 'English instructions', value: 'Instructions', type: 'eng_instructions' },
    { id: 5, displayName: 'Swedish instructions', value: 'anvisning', type: 'swe_instructions' },
    { id: 6, displayName: 'Finnish instructions', value: 'Ohjeita', type: 'fin_instructions' }
  )

  data.open = false
  data.active = false

  data.immediate_feedback = false
  data.type = type
  data.structure = {}
  const { structure } = data

  structure.openQuestions = []
  const id = (parseInt(courseData.reduce((c, d) => (c.id > d.id ? c : d)).id) + 1)

  structure.finalGrade = [{
    name: 'Anna itsellesi loppuarvosana kurssista',
    eng_name: 'Give yourself a final grade for the course',
    swe_name: 'Låta en final grad till själv, lmao ei näin :D',
    textFieldOn: true,
    id
  }]
  if (data.type === 'category') {
    structure.questionModules = []
    courseData.map(ciO =>
      structure.questionModules.push({
        id: ciO.id,
        name: ciO.name,
        textFieldOn: true
      }))
  } else {
    structure.questionModules = []
    courseData.map(ciO =>
      structure.questionModules.push({
        id: ciO.id,
        name: ciO.name,
        objectives: ciO.objectives.map(o => ({
          id: o.id,
          name: o.name
        })),
        options: ['osaan huonosti', 'osaan keskinkertaisesti', 'osaan hyvin']
      }))
  }
  return data
}

export const selfAssesmentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INIT_FORM': {
      const data = initForm(action.payload)
      return { ...state, createForm: data }
    }
    case 'TOGGLE_TEXT_FIELD': {
      const id = action.payload
      const toChange = state.createForm
      let { questionModules } = toChange.structure
      questionModules = questionModules.map(o =>
        (o.id !== id ? o : { ...o, textFieldOn: !o.textFieldOn }))

      toChange.structure.questionModules = questionModules
      return { ...state, createForm: toChange }
    }
    case 'TOGGLE_DOWN': {
      const toChange = state.createForm
      const id = action.payload
      const { questionModules } = toChange.structure
      const a = questionModules.findIndex(x => x.id === id)
      const b = questionModules[a]
      if (a < questionModules.length - 1) {
        questionModules[a] = questionModules[a + 1]
        questionModules[a + 1] = b
      }
      toChange.structure.questionModules = questionModules
      return { ...state, createForm: toChange }
    }
    case 'TOGGLE_UP': {
      const toChange = state.createForm
      const { questionModules } = toChange.structure

      const id = action.payload
      const a = questionModules.findIndex(x => x.id === id)
      const b = questionModules[a]

      if (a > 0) {
        questionModules[a] = questionModules[a - 1]
        questionModules[a - 1] = b
      }
      toChange.structure.questinModules = questionModules

      return { ...state, createForm: toChange }
    }
    case 'ADD_OPEN_QUESTION': {
      const questionData = action.payload
      const toChange = state.createForm
      let { openQuestions } = toChange.structure

      if (openQuestions.length > 0) {
        openQuestions = openQuestions.concat({
          id: openQuestions[openQuestions.length - 1].id + 1,
          name: questionData
        })
      } else {
        const id = (parseInt(toChange.structure.finalGrade[0].id) + 1).toString()
        openQuestions = openQuestions.concat({
          id,
          name: questionData
        })
      }
      toChange.structure.openQuestions = openQuestions
      return { ...state, structure: toChange }
    }
    case 'REMOVE_OPEN_QUESTION': {
      const id = action.payload
      const toChange = state.createForm
      toChange.structure.openQuestions = toChange.structure.openQuestions.filter(oQ => oQ.id !== id)
      return { ...state, structure: toChange }
    }

    case 'CHANGE_TEXT_FIELD': {
      const { type, value } = action.payload
      const toChange = state.createForm
      let { formInfo } = toChange
      const changedValue = formInfo.find(t =>
        t.type === type)
      changedValue.value = value
      formInfo = formInfo.map(inst => (inst.type === type ? changedValue : inst))

      toChange.formInfo = formInfo

      return { ...state, createForm: toChange }
    }

    case 'CREATE_SELF_ASSESMENT_SUCCESS': {
      const selfAssesments = state.userSelfAssesments.concat(action.payload.data.data)
      return { ...state, createForm: [], userSelfAssesments: selfAssesments }
    }

    case 'GET_ALL_USER_SELFASSESMENTS_SUCCESS': {
      return { ...state, userSelfAssesments: action.payload.data }
    }

    default:
      return state
  }


}

export default selfAssesmentReducer

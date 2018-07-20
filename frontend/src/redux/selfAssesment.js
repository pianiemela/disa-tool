const INITIAL_STATE = {
  createForm: {},
  userSelfAssesments: []
}


const initForm = (payload) => {
  const { courseData, type, courseInfo } = payload
  const data = {}
  data.course_instance_id = courseInfo.id
  const formInfo = []

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
  structure.displayCoursename = courseInfo.name
  structure.formInfo = formInfo

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
    structure.type = 'category'
    structure.questionModules = []
    courseData.map(ciO =>
      structure.questionModules.push({
        id: ciO.id,
        name: ciO.name,
        textFieldOn: true,
        includedInAssesment: true
      }))
  } else {
    structure.questionModules = []
    structure.type = 'objectives'
    courseData.map(ciO =>
      structure.questionModules.push({
        id: ciO.id,
        name: ciO.name,
        objectives: ciO.objectives.map(o => ({
          id: o.id,
          name: o.name,
          includedInAssesment: true
        })),
        includedInAssesment: true,
        options: ['osaan huonosti', 'osaan keskinkertaisesti', 'osaan hyvin']
      }))
  }
  return data
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
      formInfo.push(data.eng_name, data.fin_name, data.swe_name, data.eng_description, data.fin_description, data.swe_description)
      data.formInfo = formInfo
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
      let { formInfo } = toChange.structure
      const changedValue = formInfo.find(t =>
        t.type === type)
      changedValue.value = value
      formInfo = formInfo.map(inst => (inst.type === type ? changedValue : inst))
      toChange.structure.formInfo = formInfo
      return { ...state, createForm: toChange }
    }

    case 'TOGGLE_FORM_PART': {
      const { id } = action.payload
      const toChange = state.createForm
      let { questionModules } = toChange.structure
      const togQ = questionModules.find(qm => qm.id === id)
      togQ.includedInAssesment = !togQ.includedInAssesment
      questionModules = questionModules.map(qm => (qm.id !== togQ.id ?
        qm : togQ))
      toChange.structure.questionModules = questionModules
      return {
        ...state, createForm: toChange
      }
    }
    case 'CREATE_SELF_ASSESMENT_SUCCESS': {
      console.log(action.payload)
      const selfAssesments = state.userSelfAssesments.concat(action.payload.data.data)
      return { ...state, createForm: [], userSelfAssesments: selfAssesments }
    }

    case 'GET_ALL_USER_SELFASSESMENTS_SUCCESS': {
      return { ...state, userSelfAssesments: action.payload.data }
    }
    case 'SELF_ASSESMENT_UPDATE_SUCCESS': {
      const { data } = action.payload
      let sa = state.userSelfAssesments
      sa = sa.map(s => (s.id === data.id ? data : s))
      return { ...state, userSelfAssesments: sa }
    }
    default:
      return state
  }
}

export default selfAssesmentReducer

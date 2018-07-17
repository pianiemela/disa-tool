const INITIAL_STATE = []


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
    { id: 4, displayName: 'English instructions', value: 'ÖYGHH', type: 'eng_instructions' },
    { id: 5, displayName: 'Swedish instructions', value: 'ÖYGHH ÖYGHH', type: 'swe_instructions' },
    { id: 6, displayName: 'Finnish instructions', value: 'ÖYGHH ÖYGHH ÖYGHH', type: 'fin_instructions' }
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

export const selfAssesmentCreateReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INIT_FORM': {
      const data = initForm(action.payload)
      return data
    }
    case 'TOGGLE_TEXT_FIELD': {
      const id = action.payload
      const toChange = state.structure
      toChange.questionModules = toChange.questionModules.map(o =>
        (o.id !== id ? o : { ...o, textFieldOn: !o.textFieldOn }))
      return { ...state, structure: toChange }
    }
    case 'TOGGLE_DOWN': {
      const toChange = state.structure
      const id = action.payload
      const a = toChange.questionModules.findIndex(x => x.id === id)
      const b = toChange.questionModules[a]
      if (a < toChange.questionModules.length - 1) {
        toChange.questionModules[a] = toChange.questionModules[a + 1]
        toChange.questionModules[a + 1] = b
      }
      return { ...state, structure: toChange }
    }
    case 'TOGGLE_UP': {
      const toChange = state.structure
      const id = action.payload
      const a = toChange.questionModules.findIndex(x => x.id === id)
      const b = toChange.questionModules[a]

      if (a > 0) {
        toChange.questionModules[a] = toChange.questionModules[a - 1]
        toChange.questionModules[a - 1] = b
      }
      return { ...state, structure: toChange }
    }
    case 'ADD_OPEN_QUESTION': {
      const questionData = action.payload
      const toChange = state.structure
      if (toChange.openQuestions.length > 0) {
        toChange.openQuestions = toChange.openQuestions.concat({
          id: toChange.openQuestions[toChange.openQuestions.length - 1].id + 1,
          name: questionData
        })
      } else {
        const id = (parseInt(toChange.finalGrade[0].id) + 1).toString()
        toChange.openQuestions = toChange.openQuestions.concat({
          id,
          name: questionData
        })
      }
      return { ...state, structure: toChange }
    }
    case 'REMOVE_OPEN_QUESTION': {
      const id = action.payload
      const toChange = state.structure
      toChange.openQuestions = toChange.openQuestions.filter(oQ => oQ.id !== id)
      return { ...state, structure: toChange }
    }

    case 'CHANGE_TEXT_FIELD': {
      console.log(`WE ARE HERE`)
      console.log(action.payload)
      const { type, value } = action.payload
      let toChange = state.formInfo
      const changedValue = toChange.find(t =>
        t.type === type)
      changedValue.value = value
      toChange = toChange.map(inst => (inst.type === type ? changedValue : inst))
      return { ...state, formInfo: toChange }
    }
    default:
      return state
  }
}

export default selfAssesmentCreateReducer

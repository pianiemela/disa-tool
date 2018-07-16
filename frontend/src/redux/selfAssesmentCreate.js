const INITIAL_STATE = []


const initForm = (payload) => {
  const { courseData, type, courseInfo } = payload
  const data = {}
  data.course_instance_id = courseInfo.id
  data.displayCoursename = courseInfo.name
  data.eng_name = ''
  data.fin_name = ''
  data.swe_name = ''

  data.eng_instructions = ''
  data.swe_instructions = ''
  data.fin_instruction = ''

  data.open = false
  data.active = false

  data.immediate_feedback = {}
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

    default:
      return state
  }
}

export default selfAssesmentCreateReducer

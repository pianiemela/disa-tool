const INITIAL_STATE = []


const initForm = (payload) => {
  const { courseData, type } = payload
  const data = {}
  data.name = 'Linis'
  data.type = type
  data.openQuestions = []
  const id = (parseInt(courseData.reduce((c, d) => (c.id > d.id ? c : d)).id) + 1).toString()

  data.finalGrade = [{
    name: 'Anna itsellesi loppuarvosana kurssista',
    eng_name: 'Give yourself a final grade for the course',
    swe_name: 'Låta en final grad till själv, lmao ei näin :D',
    textFieldOn: true,
    id
  }]
  if (data.type === 'category') {
    data.questionModules = []
    courseData.map(ciO =>
      data.questionModules.push({
        id: ciO.id,
        name: ciO.name,
        textFieldOn: true
      }))
  } else {
    data.questionModules = []
    courseData.map(ciO =>
      data.questionModules.push({
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
      const toChange = state
      toChange.questionModules = toChange.questionModules.map(o =>
        (o.id !== id ? o : { ...o, textFieldOn: !o.textFieldOn }))
      return { ...state, questionModules: toChange.questionModules }
    }
    case 'TOGGLE_DOWN': {
      const toChange = state
      const id = action.payload
      const a = toChange.questionModules.findIndex(x => x.id === id)
      const b = toChange.questionModules[a]
      if (a < toChange.questionModules.length - 1) {
        toChange.questionModules[a] = toChange.questionModules[a + 1]
        toChange.questionModules[a + 1] = b
      }
      return { ...state, questionModules: toChange.questionModules }
    }
    case 'TOGGLE_UP': {
      const toChange = state
      const id = action.payload
      const a = toChange.questionModules.findIndex(x => x.id === id)
      const b = toChange.questionModules[a]

      if (a > 0) {
        toChange.questionModules[a] = toChange.questionModules[a - 1]
        toChange.questionModules[a - 1] = b
      }
      return { ...state, questionModules: toChange.questionModules }
    }
    case 'ADD_OPEN_QUESTION': {
      const questionData = action.payload
      const toChange = state
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
      return { ...state, openQuestions: toChange.openQuestions }
    }
    case 'REMOVE_OPEN_QUESTION': {
      const id = action.payload
      const toChange = state
      toChange.openQuestions = toChange.openQuestions.filter(oQ => oQ.id !== id)
      return { ...state, openQuestions: toChange.openQuestions }
    }

    default:
      return state
  }
}

export default selfAssesmentCreateReducer

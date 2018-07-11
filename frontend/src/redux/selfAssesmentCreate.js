const INITIAL_STATE = []

export const selfAssesmentCreateReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INIT_FORM': {
      const { courseData, type } = action.payload
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
    case 'TOGGLE_TEXT_FIELD': {
      const id = action.payload
      const toChange = state
      toChange.questionModules = toChange.questionModules.map(o =>
        (o.id !== id ? o : { ...o, textFieldOn: !o.textFieldOn }))
      return { ...state, questionModules: toChange.questionModules }
    }
    default:
      return state
  }
}

export default selfAssesmentCreateReducer

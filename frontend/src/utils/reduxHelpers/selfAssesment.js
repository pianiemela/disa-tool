const initForm = (payload) => {
  const { courseData, type, courseInfo } = payload
  const data = {}
  data.course_instance_id = courseInfo.id
  const formInfo = []

  formInfo.push(
    { id: 1, displayName: 'Eng', value: 'English Display', type: 'eng_name' },
    { id: 3, displayName: 'Swe', value: 'Swedish Display', type: 'swe_name' },
    { id: 2, displayName: 'Fin', value: 'Finnish display', type: 'fin_name' },
  )
  formInfo.push(
    { id: 4, displayName: 'Eng', value: 'Instructions', type: 'eng_instructions' },
    { id: 5, displayName: 'Swe', value: 'anvisning', type: 'swe_instructions' },
    { id: 6, displayName: 'Fin', value: 'Ohjeita', type: 'fin_instructions' }
  )

  data.open = false
  data.active = false

  data.immediate_feedback = false
  data.type = type
  data.structure = {}
  const { structure } = data
  structure.displayCoursename = courseInfo.name
  if (!structure.displayCoursename) {
    structure.displayCoursename = courseInfo[`${localStorage.getItem('lang')}.name`]
  }
  structure.formInfo = formInfo

  structure.openQuestions = []
  const id = (parseInt(courseData.reduce((c, d) => (c.id > d.id ? c : d)).id, 10) + 1)

  const headers = []

  headers.push(
    { id: 1, displayName: 'Fin: ', value: 'Anna itsellesi loppuarvosana kurssista', type: 'fin_name' },
    { id: 2, displayName: 'Eng: ', value: 'Give yourself a final grade for the course', type: 'eng_name' },
    { id: 3, displayName: 'Swe: ', value: 'Låta en final grad till själv', type: 'swe_name' }
  )

  structure.finalGrade = {
    headers,
    textFieldOn: true,
    includedInAssesment: true,
    id
  }

  structure.headers = {}

  if (data.type === 'category') {
    structure.headers.questionHeaders = [
      { id: 1, displayName: 'Fin: ', value: 'Kategoriaosio', type: 'fin_name' },
      { id: 2, displayName: 'Eng: ', value: 'Categoryquestions', type: 'eng_name' },
      { id: 3, displayName: 'Swe: ', value: 'Den här kategoria', type: 'swe_name' }
    ]
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
    structure.headers.questionHeaders = [
      { id: 1, displayName: 'Fin: ', value: 'Tavoiteosio', type: 'fin_name' },
      { id: 2, displayName: 'Eng: ', value: 'Objectivequestions', type: 'eng_name' },
      { id: 3, displayName: 'Swe: ', value: 'Den här objektiver', type: 'swe_name' }
    ]
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
  data.structure.headers.openQ = [
    { id: 3, displayName: 'Fin: ', value: 'Avoimet kysymykset', type: 'fin_name' },
    { id: 4, displayName: 'Eng: ', value: 'Open questions', type: 'eng_name' },
    { id: 5, displayName: 'Swe: ', value: 'Öppnä jotain', type: 'swe_name' }

  ]

  data.structure.headers.grade = [
    { id: 6, displayName: 'Fin: ', value: 'Loppuarvio', type: 'fin_name' },
    { id: 7, displayName: 'Eng: ', value: 'Final grade', type: 'eng_name' },
    { id: 8, displayName: 'Swe: ', value: 'Final grääd', type: 'swe_name' }
  ]
  return data
}

export default initForm
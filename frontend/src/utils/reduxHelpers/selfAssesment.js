export const initForm = (payload) => {
  const lang = localStorage.getItem('lang')
  const name = `${lang}_name`
  const instructions = `${lang}_instructions`
  const { courseData, type, courseInfo } = payload
  const data = {}
  data.course_instance_id = courseInfo.id
  const formInfo = []

  formInfo.push(
    { id: 1, prefix: 'Fin', value: 'Itsearviointitehtävä', type: 'fin_name' },
    { id: 2, prefix: 'Eng', value: 'Self-assessment task', type: 'eng_name' },
    { id: 3, prefix: 'Swe', value: 'Självbedömning', type: 'swe_name' }
  )
  formInfo.push(
    {
      id: 4,
      prefix: 'Fin',
      header: 'Ohjeita',
      value: 'Ohjeet itsearvioon',
      type: 'fin_instructions'
    },
    {
      id: 5,
      prefix: 'Eng',
      header: 'Instructions',
      value: 'Instructions for self assessment',
      type: 'eng_instructions'
    },
    {
      id: 6,
      prefix: 'Swe',
      header: 'Anvisning',
      value: 'Ohjeet itsearvioon ruotsiksi',
      type: 'swe_instructions'
    }
  )

  data.open = false
  data.active = false

  data.show_feedback = false
  data.type = type
  data.structure = {}
  data.name = formInfo.slice(0, 3).find((f) => f.type === name).value
  data.instructions = {
    header: formInfo.slice(3, 6).find((f) => f.type === instructions).header,
    value: formInfo.slice(3, 6).find((f) => f.type === instructions).value
  }

  const { structure } = data

  if (!structure.displayCoursename) {
    structure.displayCoursename =
      courseInfo[`${localStorage.getItem('lang')}_name`]
  }
  structure.formInfo = formInfo
  structure.openQuestions = {}
  structure.openQuestions.questions = []
  const id =
    parseInt(courseData.reduce((c, d) => (c.id > d.id ? c : d)).id, 10) + 1
  structure.openQuestions.incrementId = id + 1

  const headers = []

  headers.push(
    {
      id: 1,
      prefix: 'Fin:',
      value: 'Anna itsellesi loppuarvosana kurssista',
      type: 'fin_name'
    },
    {
      id: 2,
      prefix: 'Eng:',
      value: 'Give yourself a final grade for the course',
      type: 'eng_name'
    },
    {
      id: 3,
      prefix: 'Swe:',
      value: 'Låta en final grad till själv',
      type: 'swe_name'
    }
  )

  structure.finalGrade = {
    headers,
    textFieldOn: true,
    includedInAssesment: true,
    id,
    header: null,
    name: headers.find((h) => h.type === name).value
  }

  structure.headers = {}

  if (data.type === 'category') {
    structure.type = 'category'
    structure.questionModules = []
    courseData.map((ciO) =>
      structure.questionModules.push({
        id: ciO.id,
        name: ciO.name,
        textFieldOn: true,
        includedInAssesment: true
      })
    )
  } else {
    structure.questionModules = []
    structure.type = 'objectives'
    courseData.map((ciO) =>
      structure.questionModules.push({
        id: ciO.id,
        name: ciO.name,
        objectives: ciO.objectives.map((o) => ({
          id: o.id,
          name: o.name,
          includedInAssesment: true
        })),
        includedInAssesment: true,
        options: ['osaan huonosti', 'osaan keskinkertaisesti', 'osaan hyvin']
      })
    )
  }

  structure.headers.questionHeaders = [
    { id: 1, prefix: 'Fin:', value: 'Kysymykset', type: 'fin_name' },
    { id: 2, prefix: 'Eng:', value: 'Questions', type: 'eng_name' },
    { id: 3, prefix: 'Swe:', value: 'Ruotsiksi sama', type: 'swe_name' }
  ]

  data.structure.headers.openQ = [
    { id: 3, prefix: 'Fin:', value: 'Avoimet kysymykset', type: 'fin_name' },
    { id: 4, prefix: 'Eng:', value: 'Open questions', type: 'eng_name' },
    { id: 5, prefix: 'Swe:', value: 'Öppnä jotain', type: 'swe_name' }
  ]

  data.structure.headers.grade = [
    { id: 6, prefix: 'Fin:', value: 'Loppuarvio', type: 'fin_name' },
    { id: 7, prefix: 'Eng:', value: 'Final grade', type: 'eng_name' },
    { id: 8, prefix: 'Swe:', value: 'Final grääd', type: 'swe_name' }
  ]
  data.structure.finalGrade.header = data.structure.headers.grade.find(
    (h) => h.type === name
  ).value
  data.structure.questionModuleName = structure.headers.questionHeaders.find(
    (h) => h.type === name
  ).value //eslint-disable-line
  data.structure.openQuestions.name = data.structure.headers.openQ.find(
    (h) => h.type === name
  ).value //eslint-disable-line
  return data
}

export const initResponseForm = (data) => {
  const { questionModules, finalGrade, type } = data.structure
  const { questions } = data.structure.openQuestions
  const response = {}
  response.assessmentId = data.id
  response.course_instance_id = data.course_instance_id
  response.questionModuleResponses = []
  response.openQuestionResponses = []
  response.assessmentType = type

  if (type !== 'objectives') {
    questionModules.map((qm) =>
      qm.includedInAssesment
        ? response.questionModuleResponses.push({
            id: qm.id,
            responseText: '',
            textFieldOn: qm.textFieldOn,
            grade: null,
            grade_name: null,
            name: qm.name
          })
        : null
    )
  } else {
    questionModules.map((qm) =>
      qm.includedInAssesment
        ? qm.objectives.map((qmO) =>
            qmO.includedInAssesment
              ? response.questionModuleResponses.push({
                  id: qmO.id,
                  grade: null,
                  name: qmO.name,
                  header: qm.name,
                  category: qm.id
                })
              : null
          )
        : null
    )
  }

  questions.map((q) =>
    response.openQuestionResponses.push({
      id: q.id,
      responseText: '',
      name: q.name
    })
  )

  response.finalGradeResponse = {}

  if (finalGrade.includedInAssesment) {
    response.finalGradeResponse.responseText = ''
    ;(response.finalGradeResponse.grade = null),
      (response.finalGradeResponse.grade_name = null),
      (response.finalGradeResponse.headers = finalGrade.headers)
  }

  return response
}

export const respond = (state, payload, typeOfResponse) => {
  const { id, value, final, name } = payload
  if (Object.keys(state.assesmentResponse).length === 0) {
    return state
  }

  if (!final) {
    return {
      ...state,
      assesmentResponse: {
        ...state.assesmentResponse,
        questionModuleResponses: state.assesmentResponse.questionModuleResponses.map(
          (qmRes) =>
            qmRes.id === id
              ? {
                  ...qmRes,
                  [typeOfResponse]: value,
                  grade_name: name || qmRes.grade_name
                }
              : qmRes
        )
      }
    }
  }
  return {
    ...state,
    assesmentResponse: {
      ...state.assesmentResponse,
      finalGradeResponse: {
        ...state.assesmentResponse.finalGradeResponse,
        [typeOfResponse]: value,
        grade_name:
          name || state.assesmentResponse.finalGradeResponse.grade_name
      }
    }
  }
}

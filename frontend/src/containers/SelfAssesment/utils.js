import { getByCourse } from '../../api/grades'

const lang = localStorage.getItem('lang')

const findPre = (a, b, data) => {
  let iterator = { ...a }
  if (iterator.prerequisite === b.id) {
    return true
  }
  const prerequisiteFinder = d => d.id === iterator.prerequisite
  while (iterator.prerequisite) {
    iterator = data.find(prerequisiteFinder)
    if (a.id === b.id) {
      return true
    }
  }
  return false
}

export const gradeOptions = async (courseInstanceId) => {
  const grades = await getByCourse({ id: courseInstanceId })
  const { data } = grades.data
  data.sort((a, b) => {
    if (!a.prerequisite && !b.prerequisite) {
      return Number.parseInt(a.name, 0) - Number.parseInt(b.name, 0)
    }
    if (!a.prerequisite) {
      return -1
    }
    if (!b.prerequisite) {
      return 1
    }

    if (findPre(a, b, data)) {
      return 1
    }
    if (findPre(b, a, data)) {
      return -1
    }
    return 0
  })
  return data.map(d => ({ text: d.name, value: d.id }))
}

export const objectiveGrades =
{
  0: 'Selkeästi kehitettävää',
  1: 'Osaan kohtalaisesti',
  2: 'Osaan hyvin'
}

export const validationErrors = {
  fin: 'Et vastannut kaikkiin kysymyksiin, tarkista merkityt kohdat',
  swe: 'Du måste öögh ???',
  eng: 'There were questions you did not respond to. Check the marked questions'
}

const errorMessages = {
  max: { eng: 'Input length can\'t be over', swe: 'Ruotsiksi sama errori', fin: 'Vastaus saa olla pituudeltaan enintään' },
  min: { eng: 'Input length can\'t be under', swe: 'Ruotsiksi sama errori', fin: 'Vastauksen tulee olla pituudeltaan vähintään' },
  exists: { eng: 'You must select an value', swe: 'Ruotsiksi sama', fin: 'Valitse arvo' }
}

export const maxLength = (toCheck, toCheckAttribute, max, acc) =>
  (toCheck[toCheckAttribute].length > max ? [...acc, { id: toCheck.id, error: `${errorMessages.max[lang]} ${max}` }] : acc)
export const minLength = (toCheck, toCheckAttribute, min, acc) =>
  (toCheck[toCheckAttribute].length < min ? [...acc, { id: toCheck.id, error: `${errorMessages.min[lang]} ${min}` }] : acc)
export const exists = (toCheck, toCheckAttribute, acc) =>
  (!toCheck[toCheckAttribute] ? [...acc, { id: toCheck.id, error: errorMessages.exists[lang] }] : acc)


export const checkResponseErrors = (assesmentResponse) => {
  const { questionModuleResponses, openQuestionResponses, finalGradeResponse, assessmentType }
    = assesmentResponse

  let fGrade = []
  let finalResponseMax = []
  let finalResponseMin = []
  let openQMin = []
  let openQErrors = []
  let grade = []
  let responseTextMax = []
  let responseTextMin = []

  if (assessmentType === 'category') {
    grade = questionModuleResponses.reduce((acc, qm) => exists(qm, 'grade', acc), [])
    responseTextMax = questionModuleResponses.reduce((acc, qm) => maxLength(qm, 'responseText', 2000, acc), [])
    responseTextMin = questionModuleResponses.reduce((acc, qm) => minLength(qm, 'responseText', 1, acc), [])
  }

  if (assessmentType === 'objectives') {
    questionModuleResponses.forEach((qmRes) => {
      if (!qmRes.grade) {
        if (grade.find(qm => qm.id === qmRes.category)) {
          grade = grade.map(e => (e.id === qmRes.category ? { ...e, errors: { ...e.errors, [qmRes.id]: { error: errorMessages.exists[lang] } } } : e))
        } else {
          grade = [...grade, { id: qmRes.category, errors: { [qmRes.id]: { error: errorMessages.exists[lang] } } }]
        }
      }
    })
  }

  if (Object.keys(finalGradeResponse).length > 0) {
    fGrade = exists(finalGradeResponse, 'grade', [])
    finalResponseMax = maxLength(finalGradeResponse, 'responseText', 2000, [])
    finalResponseMin = minLength(finalGradeResponse, 'responseText', 5, [])
  }

  openQMin = openQuestionResponses.reduce((acc, openQ) => minLength(openQ, 'responseText', 5, acc), [])
  openQErrors = openQuestionResponses.reduce((acc, openQ) => maxLength(openQ, 'responseText', 2000, acc), []).concat(openQMin)

  return { grade, fGrade, openQErrors, responseTextMax, finalResponseMax, responseTextMin, finalResponseMin }
}

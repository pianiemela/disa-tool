const lang = localStorage.getItem('lang')

const errorMessages = {
  max: { eng: 'Input length can\'t be over', swe: 'Ruotsiksi sama errori', fin: 'Vastaus saa olla pituudeltaan enintään' },
  min: { eng: 'Input length can\'t be under', swe: 'Ruotsiksi sama errori', fin: 'Vastauksen tulee olla pituudeltaan vähintään' },
  exists: { eng: 'You must select a value', swe: 'Ruotsiksi sama', fin: 'Valitse arvo' }
}

export const maxLength = (toCheck, toCheckAttribute, max, acc) =>
  (toCheck[toCheckAttribute].length > max ? [...acc, { id: toCheck.id, error: `${errorMessages.max[lang]} ${max}` }] : acc)
export const minLength = (toCheck, toCheckAttribute, min, acc) =>
  (toCheck[toCheckAttribute].length < min ? [...acc, { id: toCheck.id, error: `${errorMessages.min[lang]} ${min}` }] : acc)
export const exists = (toCheck, toCheckAttribute, acc) =>
  (!toCheck[toCheckAttribute] ?
    [...acc, { id: toCheck.id, error: errorMessages.exists[lang] }]
    :
    acc)


export const checkResponseErrors = (assessmentResponse) => {
  const { questionModuleResponses, openQuestionResponses, finalGradeResponse, assessmentType }
    = assessmentResponse

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
    responseTextMin = (questionModuleResponses.filter(qm => qm.textFieldOn)).reduce((acc, qm) => minLength(qm, 'responseText', 1, acc), [])
  }

  if (assessmentType === 'objectives') {
    questionModuleResponses.forEach((qmRes) => {
      if (!qmRes.grade) {
        if (grade.find(qm => qm.id === qmRes.category)) {
          grade = grade.map(e => (e.id === qmRes.category
            ? { ...e, errors: { ...e.errors, [qmRes.id]: { error: errorMessages.exists[lang] } } }
            :
            e))
        } else {
          grade = [...grade, {
            id: qmRes.category,
            errors:
              { [qmRes.id]: { error: errorMessages.exists[lang] } }
          }]
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

  return {
    grade,
    fGrade,
    openQErrors,
    responseTextMax,
    finalResponseMax,
    responseTextMin,
    finalResponseMin
  }
}

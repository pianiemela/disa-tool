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
  0: 'Osaamisessani on vielä kehitettävää',
  1: 'Osaan kohtalaisesti',
  2: 'Osaan hyvin'
}

export const validationErrors = {
  fin: 'Et vastannut kaikkiin kysymyksiin, tarkista merkityt kohdat',
  swe: 'Du måste öögh ???',
  eng: 'There were questions you did not respond to. Check the marked questions'
}

const errorMessages = {
  max: { eng: 'Input can\'t be over', swe: 'Ruotsiksi sama errori', fin: 'Vastaus saa olla pituudeltaan enintään' },
  min: { eng: 'Input can\'t be under', swe: 'Ruotsiksi sama errori', fin: 'Vastauksen tulee olla pituudeltaan vähintään' },
  exists: { eng: 'You must select an value', swe: 'Ruotsiksi sama', fin: 'Valitse arvo' }
}

export const maxLength = (toCheck, toCheckAttribute, max, acc) =>
  (toCheck[toCheckAttribute].length > max ? [...acc, { id: toCheck.id, error: `${errorMessages.max[lang]} ${max}` }] : acc)
export const minLength = (toCheck, toCheckAttribute, min, acc) =>
  (toCheck[toCheckAttribute].length < min ? [...acc, { id: toCheck.id, error: `${errorMessages.min[lang]} ${min}` }] : acc)
export const exists = (toCheck, toCheckAttribute, acc) =>
  (!toCheck[toCheckAttribute] ? [...acc, { id: toCheck.id, error: errorMessages.exists[lang] }] : acc)

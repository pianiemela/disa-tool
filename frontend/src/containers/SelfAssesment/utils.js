import { getByCourse } from '../../api/grades'

const findPre = (a, b, data) => {
  let iterator = { ...a }
  if (iterator.prerequisite === b.id) {
    return true
  }
  while (iterator.prerequisite) {
    iterator = data.find(d => d.id === iterator.prerequisite)
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
  maxLength: 'Can\'t have input over',
  minLength: 'Input must be atleast',
  exists: 'You must fill the field'
}

export const maxLength = (toCheck, length) =>
  (toCheck.length > length ? errorMessages[maxLength] + length : null)
export const minLength = (toCheck, length) =>
  (toCheck.length >= length ? errorMessages[minLength] + length : null)
export const exists = toCheck =>
  (!toCheck ? errorMessages[exists] : null)

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

export const objectiveGrades = () => {

  switch (lang) {
    case 'fin':
      return {
        0: 'Selkeästi kehitettävää',
        1: 'Osaan kohtalaisesti',
        2: 'Osaan hyvin'
      }
    case 'eng':
      return {
        0: 'Room for improvement',
        1: 'Decent skills',
        2: 'Good skills'
      }
    default:
      return null
  }
}

export const validationErrors = {
  fin: 'Tapahtui virhe, tarkista merkityt kohdat',
  swe: 'Du måste öögh ???',
  eng: 'There were some errors. Check the marked questions'
}
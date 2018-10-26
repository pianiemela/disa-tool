import { getByCourse } from '../../api/grades'

const lang = localStorage.getItem('lang')

export const findPre = (a, b, data) => {
  if (a.id === b.id) return false
  let iterator = { ...a }
  const prerequisiteFinder = i => (i ? data.find((d => d.id === i)) : null)

  while (iterator) {
    if (iterator.id === b.id) {
      return true
    }
    iterator = prerequisiteFinder(iterator.prerequisite)
  }
  return false
}

export const sortGrades = (data) => {
  const sorted = [...data]
  sorted.sort((a, b) => {
    if (!a.prerequisite && !b.prerequisite) {
      return Number.parseInt(a.name, 0) - Number.parseInt(b.name, 0)
    }
    if (a.id === b.id) {
      return 0
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
  return sorted
}


export const detectCycle = (grade, data) => {
  let cyclic = grade
  while (cyclic) {
    cyclic = data.find(g => (g.id === cyclic.prerequisite)) //eslint-disable-line
    if (cyclic) {
      if (cyclic.id === grade.id) {
        return true
      }
    }
  }
  return false
}

export const gradeOptions = async (courseInstanceId) => {
  const grades = await getByCourse({ id: courseInstanceId })
  const { data } = grades.data
  const isCyclic = data.some(grade => detectCycle(grade, data))
  if (isCyclic) {
    return data.map(d => ({ text: d.name, value: d.id }))
  }
  const sorted = sortGrades(data)
  return sorted.map(d => ({ text: d.name, value: d.id }))
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

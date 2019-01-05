import { getByCourse } from '../../api/grades'

const lang = localStorage.getItem('lang')

export const gradeOptions = async (courseInstanceId) => {
  const grades = await getByCourse({ id: courseInstanceId })
  const { data } = grades.data
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

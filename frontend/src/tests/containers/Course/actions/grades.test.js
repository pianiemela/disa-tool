import { getGrades, addGrade, removeGrade, editGrade } from '../../../../containers/Course/actions/grades'
import { testService } from '../../../testUtils'

testService({
  func: getGrades,
  type: {
    success: 'GRADE_GET_MANY'
  },
  data: { id: 3 },
  apiRoute: '/grades/course/3',
  apiMethod: 'get'
})

testService({
  func: addGrade,
  type: {
    success: 'GRADE_CREATE'
  },
  data: {
    eng_name: 'en',
    fin_name: 'fn',
    swe_name: 'sn',
    skill_level_id: 1,
    needed_for_grade: 0.5,
    prerequisite: null
  },
  apiRoute: '/grades/create',
  apiMethod: 'post'
})

testService({
  func: removeGrade,
  type: {
    success: 'GRADE_DELETE'
  },
  data: { id: 3 },
  apiRoute: '/grades/3',
  apiMethod: 'delete'
})

testService({
  func: editGrade,
  type: {
    success: 'GRADE_EDIT'
  },
  data: {
    id: 3,
    eng_name: 'en',
    fin_name: 'fn',
    swe_name: 'sn',
    skill_level_id: 1,
    needed_for_grade: 0.5,
    prerequisite: null
  },
  apiRoute: '/grades/3',
  apiMethod: 'put'
})

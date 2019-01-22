import React from 'react'
import { arrayOf, shape, func, bool } from 'prop-types'
import StudentAssesmentList from './components/StudentAssesmentList'
import TeacherAssesmentList from './components/TeacherAssesmentList'

export const CourseSelfAssessmentList = ({ assesments, isTeacher, toggleAssessment }) => {
  if (isTeacher) {
    return <TeacherAssesmentList assesments={assesments} toggleAssessment={toggleAssessment} />
  }
  return <StudentAssesmentList assesments={assesments} />
}

CourseSelfAssessmentList.propTypes = {
  assesments: arrayOf(shape({})).isRequired,
  isTeacher: bool.isRequired,
  toggleAssessment: func.isRequired
}

export default CourseSelfAssessmentList

import React, { useState } from 'react'
import { arrayOf, string, func, number, shape, objectOf } from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'
import { CSVLink } from 'react-csv'
import { objectiveGrades } from '../../../SelfAssessmentForm/utils'

const replaceQuotesAndLineBreaks = str => (
  typeof str === 'string' ? (
    str.replace(/["]/g, '""').replace(/(\r\n|\n|\r)/gm, ' ')
  ) : ''
)

const formatToCsv = (students, grades) => {
  const formatted = students.map((student) => {
    const findGradeName = (gradeReview) => {
      if (!gradeReview) return '-'
      const grade = grades[gradeReview.id]
      if (!grade) return '-'
      return grade.name
    }
    const questionResponses = (
      student.categories ? (
        student.categories.map(category => ({
          [`${category.name}_text`]: (
            category.responseGrade ? (
              replaceQuotesAndLineBreaks(category.responseGrade.text)
            ) : ''
          ),
          [`${category.name}_grade`]: findGradeName(category.responseGrade),
          [`${category.name}_calculated_grade`]: findGradeName(category.feedbackGrade)
        }))
      ) : (
        student.objectives.map(objective => ({
          [objective.name]: objectiveGrades()[objective.answer]
        }))
      )
    )
    const openResponses = student.openResponses.map((response, index) => (
      { [`open_question_${index + 1}_text`]: replaceQuotesAndLineBreaks(response.text) }
    ))
    const { finalGrade } = student
    const finalResponse = finalGrade ?
      { final_grade_text: replaceQuotesAndLineBreaks(finalGrade.responseGrade.text),
        final_grade_grade: findGradeName(finalGrade.responseGrade),
        final_grade_calculated_grade: findGradeName(finalGrade.feedbackGrade) }
      : {}
    const flattenedQuestions = questionResponses.reduce((acc, curr) => ({ ...acc, ...curr }), {})
    const flattenedOpens = openResponses.reduce((acc, curr) => ({ ...acc, ...curr }), {})
    return {
      studentnumber: student.studentnumber,
      name: student.name,
      ...flattenedQuestions,
      ...flattenedOpens,
      ...finalResponse
    }
  })
  return formatted
}

const CSVDownload = ({
  students,
  grades,
  filePrefix,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.Review.CSVDownload.${id}`)
  const [data, setData] = useState('')

  const prepare = () => {
    setData(formatToCsv(students, grades))
  }

  return (
    <Button
      as={CSVLink}
      onClick={prepare}
      basic
      color="green"
      content={translate('download_csv')}
      filename={`${filePrefix}_responses.csv`}
      data={data}
    />
  )
}

CSVDownload.propTypes = {
  students: arrayOf(shape({
    id: number.isRequired,
    studentnumber: string.isRequired,
    categories: arrayOf(shape({
      id: number.isRequired,
      name: string.isRequired,
      responseGrade: shape({
        id: number.isRequired,
        depth: number.isRequired
      }),
      feedbackGrade: shape({
        id: number.isRequired,
        depth: number.isRequired
      }).isRequired
    }).isRequired),
    finalGrade: shape({
      responseGrade: shape({
        id: number.isRequired,
        depth: number.isRequired
      }),
      feedbackGrade: shape({
        id: number.isRequired,
        depth: number.isRequired
      }).isRequired
    })
  }).isRequired).isRequired,
  grades: objectOf(shape({
    name: string.isRequired
  })).isRequired,
  filePrefix: string,
  translate: func.isRequired
}

CSVDownload.defaultProps = {
  filePrefix: ''
}

export default withLocalize(CSVDownload)

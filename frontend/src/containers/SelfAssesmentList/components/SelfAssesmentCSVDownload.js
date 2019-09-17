import React, { PureComponent } from 'react'
import { arrayOf, string, func } from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'
import { CSVLink } from 'react-csv'
import { responseProp } from '../propTypes'
import { objectiveGrades } from '../../SelfAssessmentForm/utils'

const replaceQuotesAndLineBreaks = str => (
  typeof str === 'string' ? (
    str.replace(/["]/g, '""').replace(/(\r\n|\n|\r)/gm, ' ')
  ) : ''
)

const formatToCsv = (responses) => {
  const formatted = responses.map((response) => {
    const findCalculatedGrade = (question) => {
      const { verification } = response.response
      const category = verification ?
        verification.categoryVerifications.find(c => c.categoryId === question.id)
        : { earnedGrade: { name: '' } }
      return category.earnedGrade.name
    }
    const questionResponses = response.response.questionModuleResponses.map(question => (
      // If question modules are by category, then responseText will be populated.
      // This is a hacky way of sequestering the two possibilities.
      question.responseText ? ({
        [`${question.name}_text`]: replaceQuotesAndLineBreaks(question.responseText),
        [`${question.name}_grade`]: question.grade_name,
        [`${question.name}_calculated_grade`]: findCalculatedGrade(question)
      }) : ({
        [question.name]: objectiveGrades()[question.grade]
      })
    ))
    const openResponses = response.response.openQuestionResponses.map(question => (
      { [`${question.name}_text`]: replaceQuotesAndLineBreaks(question.responseText) }
    ))
    const { finalGradeResponse, verification } = response.response
    const finalResponse = finalGradeResponse.name ?
      { [`${finalGradeResponse.name}_text`]: replaceQuotesAndLineBreaks(finalGradeResponse.responseText),
        [`${finalGradeResponse.name}_grade`]: finalGradeResponse.grade_name,
        [`${finalGradeResponse.name}_min_grade`]: verification ?
          verification.overallVerification.minGrade : '',
        [`${finalGradeResponse.name}_max_grade`]: verification ?
          verification.overallVerification.maxGrade : '' }
      : {}
    const flattenedQuestions = questionResponses.reduce((acc, curr) => ({ ...acc, ...curr }), {})
    const flattenedOpens = openResponses.reduce((acc, curr) => ({ ...acc, ...curr }), {})
    return {
      studentnumber: response.person.studentnumber,
      name: response.person.name,
      ...flattenedQuestions,
      ...flattenedOpens,
      ...finalResponse
    }
  })
  return formatted
}

class SelfAssesmentCSVDownload extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: ''
    }
  }

  translate = id => this.props.translate(`SelfAssessmentList.SelfAssesmentCSVDownload.${id}`)

  prepare = async () => {
    const { responses } = this.props
    await this.setState({
      data: formatToCsv(responses)
    })
  }

  render() {
    const { data } = this.state
    const { filePrefix, responses } = this.props
    return (
      <Button
        disabled={responses.length === 0}
        as={CSVLink}
        onClick={this.prepare}
        basic
        color="green"
        content={this.translate('download_csv')}
        filename={`${filePrefix}_responses.csv`}
        data={data}
      />
    )
  }
}

SelfAssesmentCSVDownload.propTypes = {
  responses: arrayOf(responseProp).isRequired,
  filePrefix: string,
  translate: func.isRequired
}

SelfAssesmentCSVDownload.defaultProps = {
  filePrefix: ''
}

const mapStateToProps = state => ({
  filePrefix: state.selfAssesmentList.selfAssesmentName,
  responses: state.selfAssesmentList.selectedResponses
})

export default withLocalize(connect(mapStateToProps, null)(SelfAssesmentCSVDownload))

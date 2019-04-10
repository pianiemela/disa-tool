import React from 'react'
import { func, shape, string, objectOf, number } from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Card, Header } from 'semantic-ui-react'

const FinalGradeFeedback = ({
  feedback,
  grades,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm..FinalGradeQuestion.FinalGradeFeedback.${id}`)
  if (!feedback || !feedback.finalGrade) return null
  const findGradeName = (gradeReview) => {
    if (!gradeReview) return '-'
    const grade = grades[gradeReview.id]
    if (!grade) return '-'
    return grade.name
  }
  const { responseGrade } = feedback.finalGrade
  return (
    <div>
      <Header>{translate('final_grade')}</Header>
      <Card fluid color="red" >
        <Card.Content >
          <Card.Description textAlign="center">
            <Header>
              {translate('assessedGrade')}: {findGradeName(responseGrade)}
            </Header>
            {responseGrade.text.length > 0 ?
              <div>
                <h5>{translate('explanation')}:</h5>
                <p>{responseGrade.text}</p>
              </div>
              :
              null}
          </Card.Description>
        </Card.Content>
      </Card>
    </div>
  )
}

FinalGradeFeedback.propTypes = {
  feedback: shape({
    finalGrade: shape({
      responseGrade: shape({
        id: number.isRequired,
        text: string.isRequired
      }).isRequired
    })
  }),
  grades: objectOf(shape({
    name: string.isRequired
  })).isRequired,
  translate: func.isRequired
}

FinalGradeFeedback.defaultProps = {
  feedback: null
}

export default withLocalize(FinalGradeFeedback)

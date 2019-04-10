import React from 'react'
import { shape, number, string, objectOf, func } from 'prop-types'
import { Card, Accordion, Progress, Icon } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

const CategoryFeedback = ({
  category,
  grades,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.CategoryQuestion.CategoryFeedback.${id}`)
  const { responseGrade, progress } = category
  const findGradeName = (gradeReview) => {
    if (!gradeReview) return '-'
    const grade = grades[gradeReview.id]
    if (!grade) return '-'
    return grade.name
  }

  return (
    <Card.Group itemsPerRow={2}>
      <Card fluid color="red" >
        <Card.Content >
          <Card.Header textAlign="center">
            <h3>{category.name}</h3>
          </Card.Header>
          <Card.Description textAlign="center">
            <h4>
              {translate('grade')}: {findGradeName(responseGrade)}
            </h4>
            {responseGrade.text.length > 0 ?
              <div>
                <h5>{(translate('explanation'))}:</h5>
                <p>{responseGrade.text}</p>
              </div>
              :
              null}
          </Card.Description>
        </Card.Content>
      </Card>
      <Card fluid color="red">
        <Card.Content >
          <Card.Header textAlign="center">
            <h3>{translate('feedback')}</h3>
          </Card.Header>
          <Card.Description textAlign="center">
            {category.name}
          </Card.Description>
        </Card.Content>
        <Card.Content>
          {progress.map(objective => (
            <div key={objective.id}>
              <h5>{objective.name} {objective.progress === 1 ?
                <Icon color="yellow" loading name="star" size="large" /> : null}
              </h5>
              <Progress
                size="small"
                percent={(objective.progress * 100).toFixed(1)}
                progress
                indicating
              />
            </div>
          ))}
        </Card.Content>
      </Card>
    </Card.Group>
  )
}

CategoryFeedback.propTypes = {
  category: shape({
    responseGrade: shape({
      id: number.isRequired
    }).isRequired
  }).isRequired,
  grades: objectOf(shape({
    name: string.isRequired
  })).isRequired,
  translate: func.isRequired
}

export default withLocalize(CategoryFeedback)

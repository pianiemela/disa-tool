import React, { useState } from 'react'
import { shape, func, string, number, arrayOf, objectOf } from 'prop-types'
import { Accordion, Button, Table, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { withLocalize } from 'react-localize-redux'

const Feedback = ({
  selfAssessmentFormId,
  student,
  grades,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.Review.Feedback.${id}`)
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => setExpanded(!expanded)
  const findGradeName = (gradeReview) => {
    if (!gradeReview || !gradeReview.id) return '-'
    const grade = grades[gradeReview.id]
    if (!grade) return '-'
    return grade.name
  }

  return (
    <Accordion styled fluid>
      <Accordion.Title
        active={expanded}
        onClick={toggleExpanded}
        style={{ display: 'flex' }}
      >
        <span style={{ flexGrow: 0.1, flexShrink: 0 }}>{student.studentnumber}</span>
        <span style={{ flexGrow: 0.1, flexShrink: 0 }}>{student.name}</span>
        <span style={{ flexGrow: 1, flexShrink: 1 }} />
      </Accordion.Title>
      <Accordion.Content active={expanded}>
        <Button
          as={Link}
          target="_blank"
          to={`/self-assessment-form/${selfAssessmentFormId}/feedback/${student.id}`}
          basic
        >
          <span>{translate('inspect')}</span>
          <Icon name="angle double right" />
        </Button>
        {student.categories ? (
          <Table collapsing compact="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ textTransform: 'capitalize' }}>{translate('category')}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{translate('self_assessment')}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{translate('machine_review')}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{translate('difference')}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {student.categories.map(({ id, name, responseGrade, feedbackGrade }) => {
                const categoryDifference = responseGrade ? (
                  responseGrade.depth - feedbackGrade.depth
                ) : 0
                return (
                  <Table.Row key={id}>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell textAlign="center">{findGradeName(responseGrade)}</Table.Cell>
                    <Table.Cell textAlign="center">{findGradeName(feedbackGrade)}</Table.Cell>
                    <Table.Cell textAlign="center" positive={categoryDifference < 0} negative={categoryDifference > 0} >
                      {`${categoryDifference > 0 ? '+' : ''}${categoryDifference}`}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        ) : null}
        {student.finalGrade ? (
          <Table collapsing compact="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell textAlign="center">{translate('self_assessment')}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">{translate('machine_review')}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell><strong>{translate('final_grade')}</strong></Table.Cell>
                <Table.Cell textAlign="center">{findGradeName(student.finalGrade.responseGrade)}</Table.Cell>
                <Table.Cell textAlign="center">{findGradeName(student.finalGrade.feedbackGrade)}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        ) : null}
      </Accordion.Content>
    </Accordion>
  )
}

Feedback.propTypes = {
  selfAssessmentFormId: number.isRequired,
  student: shape({
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
        id: number,
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
  }).isRequired,
  grades: objectOf(shape({
    name: string.isRequired
  })).isRequired,
  translate: func.isRequired
}

export default withLocalize(Feedback)

import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import { objectiveGrades } from '../../SelfAssesment/utils'

export const ObjectivesFeedback = (props) => {
  const { objectives, teacher } = props
  const translate = id => props.translate(`SelfAssessment.FeedbackPage.ObjectivesFeedback.${id}`)

  const deepCalculations = (data) => {
    let assesmentGrade = null
    assesmentGrade = Object.keys(data).reduce((eka, toka) => (
      eka + parseInt(data[toka].grade, 0)), 0)
    assesmentGrade = Math.round(assesmentGrade / Object.keys(data).length)
    if (!(Number.isInteger(assesmentGrade))) {
      return 'Kaikkia ei ole arvioitu'
    }
    if (assesmentGrade > 0) {
      if (assesmentGrade > 1) {
        const wut = translate('objectiveAssessment.good')
        return wut
      }
      const wut = translate('objectiveAssessment.decent')
      return wut
    }
    const wut = translate('objectiveAssessment.poor')
    return wut
  }

  const grades = objectiveGrades()


  return (
    <div>
      {teacher ? null : (
        <h2>
          {translate('message')}
        </h2>
      )}
      {Object.keys(objectives).map(objective => (
        <div key={objective}>
          <p>{objective.id}</p>
          <Table fixed compact celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="2">
                  {objective}
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell colSpan="2">
                  {deepCalculations(objectives[objective])}
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell colSpan="2" />
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>
                  {translate('objective')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {translate('assessment')}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {objectives[objective].map(singleO => (
                <Table.Row key={singleO.id}>
                  <Table.Cell>
                    {singleO.name}
                  </Table.Cell>
                  <Table.Cell>
                    {singleO.grade ? grades[(singleO.grade)] : 'IMPOSSBRU'}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ))}
    </div>
  )
}

ObjectivesFeedback.defaultProps = {
  teacher: false,
  objectives: {}
}

ObjectivesFeedback.propTypes = {
  teacher: PropTypes.bool,
  objectives: PropTypes.shape(),
  translate: PropTypes.func.isRequired
}
export default withLocalize(ObjectivesFeedback)


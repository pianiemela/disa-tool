import React from 'react'
import { arrayOf, bool, func } from 'prop-types'
import { connect } from 'react-redux'
import { Button, Table } from 'semantic-ui-react'
import ResponseAccordion from './ResponseAccordion'
import { responseProp } from '../propTypes'
import { selectResponse } from '../actions/selfAssesmentList'

const finalGradeMatches = (response) => {
  const { verification, finalGradeResponse } = response.response
  if (verification && finalGradeResponse) {
    return verification.overallVerification.minGrade === finalGradeResponse.grade_name
    || verification.overallVerification.maxGrade === finalGradeResponse.grade_name
  }
  return true
}

const responseDifferences = (response) => {
  if (!response.response.verification) return <Table.Cell>-</Table.Cell>
  const { categoryVerifications } = response.response.verification
  const { length } = categoryVerifications
  const mean = categoryVerifications
    .reduce((acc, cur) => (acc + (cur.wantedGrade.difference / length)), 0)
  const sd = Math.sqrt((1 / (length - 1)) * categoryVerifications
    .reduce((acc, cur) => (acc + ((cur.wantedGrade.difference - mean) ** 2)), 0))
  return (
    <Table.Cell positive={mean < 0} negative={mean > 0}>
      {mean.toFixed(1)}, ±{sd.toFixed(1)}
    </Table.Cell>
  )
}

const ResponseTable = props => (
  <Table>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>selected</Table.HeaderCell>
        <Table.HeaderCell>student</Table.HeaderCell>
        <Table.HeaderCell>differences</Table.HeaderCell>
        <Table.HeaderCell>last updated</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {props.responses.map(response => (
        <Table.Row key={response.id}>
          <Table.Cell>
            <Button
              basic
              color="blue"
              icon={props.selected ? 'minus' : 'plus'}
              value={response.id}
              onClick={props.selectResponse(response)}
            />
          </Table.Cell>
          <Table.Cell negative={!finalGradeMatches(response)}>
            <ResponseAccordion response={response} />
          </Table.Cell>
          {responseDifferences(response)}
          <Table.Cell>{new Date(response.updated_at).toLocaleDateString()}</Table.Cell>
        </Table.Row>
    ))}
    </Table.Body>
  </Table>
)

ResponseTable.propTypes = {
  responses: arrayOf(responseProp).isRequired,
  selected: bool,
  selectResponse: func.isRequired
}

ResponseTable.defaultProps = {
  selected: false
}

const mapDispatchToProps = dispatch => ({
  selectResponse: response => () => selectResponse(dispatch)(response)
})

export default connect(null, mapDispatchToProps)(ResponseTable)

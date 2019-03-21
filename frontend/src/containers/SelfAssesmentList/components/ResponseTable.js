import React from 'react'
import { arrayOf, bool, func, shape, number } from 'prop-types'
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

export const calculateDifference = (response) => {
  if (!response.response.verification) return null
  const { categoryVerifications } = response.response.verification
  const { length } = categoryVerifications
  const mean = categoryVerifications
    .reduce((acc, cur) => (acc + (cur.wantedGrade.difference / length)), 0)
  const sd = Math.sqrt((1 / (length - 1)) * categoryVerifications
    .reduce((acc, cur) => (acc + ((cur.wantedGrade.difference - mean) ** 2)), 0))
  return { mean, sd }
}

const responseDifferences = (response) => {
  const diff = calculateDifference(response)
  if (!diff) return <Table.Cell collapsing>-</Table.Cell>
  return (
    <Table.Cell collapsing positive={diff.mean < 0} negative={diff.mean > 0}>
      {diff.mean.toFixed(1)}, ±{diff.sd.toFixed(1)}
    </Table.Cell>
  )
}

const ResponseTable = (props) => {
  const { headerindex: index, asc } = props.sortedHeader
  const { onSort } = props
  const direction = asc ? 'ascending' : 'descending'
  return (
    <Table sortable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>selected</Table.HeaderCell>
          <Table.HeaderCell sorted={index === 0 ? direction : null} onClick={() => onSort(0)}>
            studentnumber
          </Table.HeaderCell>
          <Table.HeaderCell sorted={index === 1 ? direction : null} onClick={() => onSort(1)}>
            student name
          </Table.HeaderCell>
          <Table.HeaderCell sorted={index === 2 ? direction : null} onClick={() => onSort(2)}>
            differences
          </Table.HeaderCell>
          <Table.HeaderCell sorted={index === 3 ? direction : null} onClick={() => onSort(3)}>
            last updated
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {props.responses.map(response => (
          <Table.Row key={response.id}>
            <Table.Cell collapsing>
              <Button
                basic
                color="blue"
                icon={props.selected ? 'minus' : 'plus'}
                value={response.id}
                onClick={props.selectResponse(response)}
              />
            </Table.Cell>
            <Table.Cell collapsing>{response.person.studentnumber}</Table.Cell>
            <Table.Cell negative={!finalGradeMatches(response)}>
              <ResponseAccordion response={response} />
            </Table.Cell>
            {responseDifferences(response)}
            <Table.Cell collapsing>{new Date(response.updated_at).toLocaleDateString()}</Table.Cell>
          </Table.Row>
      ))}
      </Table.Body>
    </Table>
  )
}

ResponseTable.propTypes = {
  responses: arrayOf(responseProp).isRequired,
  selected: bool,
  selectResponse: func.isRequired,
  onSort: func.isRequired,
  sortedHeader: shape({ headerindex: number.isRequired, asc: bool.isRequired }).isRequired
}

ResponseTable.defaultProps = {
  selected: false
}

const mapDispatchToProps = dispatch => ({
  selectResponse: response => () => selectResponse(dispatch)(response)
})

export default connect(null, mapDispatchToProps)(ResponseTable)

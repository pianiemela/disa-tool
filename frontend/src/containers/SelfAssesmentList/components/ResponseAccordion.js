import React, { PureComponent } from 'react'
import { number, func } from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Accordion, Button, Table, Icon } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import { responseProp } from '../propTypes'
import { activateResponse } from '../actions/selfAssesmentList'

class ResponseAccordion extends PureComponent {
  translate = id => this.props.translate(`SelfAssessmentList.SelfAssessmentListPage.${id}`)

  render() {
    const { response, selfAssesmentId, dispatchActivateResponse } = this.props
    return (
      <Accordion
        styled
        fluid
        panels={[{
          key: response.id,
          title: `${response.person.studentnumber} ${response.person.name}`,
          content: (
            <Accordion.Content key={response.id}>
              <Button
                as={Link}
                to={`/selfassessment/list/${selfAssesmentId}/${response.id}`}
                basic
                onClick={dispatchActivateResponse(response)}
              >
                <span>{this.translate('inspect')}</span>
                <Icon name="angle double right" />
              </Button>
              {response.response.assessmentType === 'category' ? (
                <Table collapsing compact="very">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell style={{ textTransform: 'capitalize' }}>{this.translate('category')}</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">{this.translate('self_assessment')}</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">{this.translate('machine_review')}</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">difference</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {response.response.questionModuleResponses.map((qmResponse) => {
                      const { verification } = response.response
                      if (!verification) {
                        return (
                          <Table.Row key={qmResponse.id}>
                            <Table.Cell>{qmResponse.name}</Table.Cell>
                            <Table.Cell textAlign="center">{qmResponse.grade_name}</Table.Cell>
                            <Table.Cell textAlign="center">-</Table.Cell>
                            <Table.Cell>-</Table.Cell>
                          </Table.Row>
                        )
                      }
                      const diff = verification.categoryVerifications
                        .find(c => qmResponse.id === c.categoryId).wantedGrade.difference
                      return (
                        <Table.Row key={qmResponse.id}>
                          <Table.Cell>{qmResponse.name}</Table.Cell>
                          <Table.Cell textAlign="center">{qmResponse.grade_name}</Table.Cell>
                          <Table.Cell textAlign="center">
                            {this.findVerifiactionGrade(verification, qmResponse.name)}
                          </Table.Cell>
                          <Table.Cell textAlign="center" positive={diff < 0} negative={diff > 0} >
                            {diff}
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table>
              ) : null}
              {response.response.finalGradeResponse ? (
                <Table collapsing compact="very">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell />
                      <Table.HeaderCell textAlign="center">{this.translate('self_assessment')}</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">{this.translate('machine_review')}</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell><strong>{this.translate('final_grade')}</strong></Table.Cell>
                      <Table.Cell textAlign="center">{response.response.finalGradeResponse.grade_name}</Table.Cell>
                      {response.response.verification ?
                        <Table.Cell textAlign="center">
                          {response.response.verification.overallVerification.minGrade}–
                          {response.response.verification.overallVerification.maxGrade}
                        </Table.Cell> : <Table.Cell>-</Table.Cell> }
                    </Table.Row>
                  </Table.Body>
                </Table>
              ) : null}
            </Accordion.Content>
          )
        }]}
      />
    )
  }
}

ResponseAccordion.propTypes = {
  response: responseProp.isRequired,
  selfAssesmentId: number.isRequired,
  translate: func.isRequired,
  dispatchActivateResponse: func.isRequired
}

const mapStateToProps = state => ({
  selfAssesmentId: state.selfAssesmentList.selfAssesmentId
})

const mapDispatchToProps = dispatch => ({
  dispatchActivateResponse: response => () => activateResponse(dispatch)(response)
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(ResponseAccordion))

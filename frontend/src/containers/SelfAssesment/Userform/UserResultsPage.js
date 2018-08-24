import React from 'react'
import PropTypes from 'prop-types'
import { Card, Table, Container } from 'semantic-ui-react'
import { objectiveGrades } from '../../SelfAssesment/utils'

const UserResultsPage = (props) => {
  const { assesmentResponse } = props
  const { assessmentType } = assesmentResponse
  const objectives = {}

  if (assesmentResponse.assessmentType === 'objectives') {
    assesmentResponse.questionModuleResponses.forEach((asr) => {
      if (!objectives[asr.header]) {
        objectives[asr.header] = []
      }
      objectives[asr.header].push(asr)
    })
  }

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
        return 'Osaan osion tavoitteet hyvin'
      }
      return 'Osaan osion tavoitteet kohtalaisesti'
    }
    return 'Vielä selkeästi kehitettävää osion tavoitteiden suhteen'
  }

  const renderFunc = () =>
    (
      <Container>
        <div>
          {props.teacher ? null : (
            <h2>
              Olet jo vastannut tähän itsearviointiin. Voit tarkastella kootusti tuloksiasi alla.
            </h2>
          )}
          {Object.keys(objectives).map(objective => (
            <div key={objective}>
              <p>{objective.id}</p>

              <Table style={{ margin: '50px' }} fixed compact celled striped>
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
                      Tavoite
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      Arvio osaamisesta
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
                        {singleO.grade ? objectiveGrades[(singleO.grade)] : 'IMPOSSBRU'}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ))}
        </div >
      </Container >
    )


  if (assessmentType === 'objectives') {
    return renderFunc()
  }
  return (
    <Container textAlign="center">
      <div>
        {props.teacher ? null : (
          <h2>
            Olet jo vastannut tähän itsearviointiin. Voit tarkastella kootusti tuloksiasi alla.
          </h2>
        )}
        {assesmentResponse.questionModuleResponses.map(questionModule => (
          <Card.Group key={questionModule.id} itemsPerRow={2}>
            <Card fluid color="red">
              <Card.Content >
                <Card.Header textAlign="center">
                  <h3>{questionModule.name}</h3>
                </Card.Header>
                <Card.Description textAlign="center">
                  <h4>
                  Itsearvioitu arvosana: {questionModule.grade}
                  </h4>
                  {questionModule.textFieldOn ?
                    <div>
                      <h5>perustelut:</h5>
                      <p>{questionModule.responseText}</p>
                    </div>
                  :
                  null}
                </Card.Description>
              </Card.Content>
            </Card>
            {assesmentResponse.feedback ?
              <Card fluid color="red">
                <Card.Content >
                  <Card.Header textAlign="center">
                    <h3>Palaute</h3>
                  </Card.Header>
                  <Card.Description textAlign="center">
                    {assesmentResponse.feedback.find(f => f.categoryId === questionModule.id).text}
                  </Card.Description>
                </Card.Content>
              </Card> : undefined}
          </Card.Group>
        ))}
      </div >
    </Container >
  )
}

UserResultsPage.propTypes = {
  assesmentResponse: PropTypes.shape().isRequired,
  teacher: PropTypes.bool
}

UserResultsPage.defaultProps = {
  teacher: false
}

export default UserResultsPage

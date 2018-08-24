import React from 'react'
import PropTypes from 'prop-types'
import { Card, Table, Container } from 'semantic-ui-react'
import { objectiveGrades } from '../../SelfAssesment/utils'

const UserResultsPage = (props) => {
  const { assessmentResponse } = props
  const { assessmentType } = assessmentResponse
  const { assessmentInfo } = props
  const objectives = {}
  console.log(assessmentResponse)

  if (assessmentResponse.assessmentType === 'objectives') {
    assessmentResponse.questionModuleResponses.forEach((asr) => {
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

  const displayObjectivesFeedback = () =>
    (
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
      </div>
    )

  const displayCategoryFeedback = () =>
    (
      <div>
        {/* {props.teacher ? null : (
        )} */}
        {assessmentResponse.questionModuleResponses.map(questionModule => (
          <Card key={questionModule.id} fluid color="red" >
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
        ))}
      </div >
    )

  const displayOpenQuestionsAndFinalGrade = () =>
    (
      <div>
        {assessmentResponse.openQuestionResponses.length > 0 ?
          <h2> Avoimet kysymykset</h2>
          :
          null}
        {
          assessmentResponse.openQuestionResponses.map(openQ => (
            <div>
              <Card key={openQ.id} fluid color="red" >
                <Card.Content >
                  <Card.Header textAlign="center">
                    <h3>{openQ.name}</h3>
                  </Card.Header>
                  <Card.Description textAlign="center">
                    <div>
                      <h5>Vastaus:</h5>
                      <p>{openQ.responseText}</p>
                    </div>

                  </Card.Description>
                </Card.Content>
              </Card>
            </div>
          ))
        }

        {
          Object.keys(assessmentResponse.finalGradeResponse).length > 1 ?
            <div>
              <h2>Arvosana</h2>
              <Card key={assessmentResponse.finalGradeResponse.name} fluid color="red" >
                <Card.Content >
                  <Card.Header textAlign="center">
                    <h3>{assessmentResponse.finalGradeResponse.name}</h3>
                  </Card.Header>
                  <Card.Description textAlign="center">
                    <h4>
                      Itsearvioitu arvosana: {assessmentResponse.finalGradeResponse.grade}
                    </h4>
                    {assessmentResponse.finalGradeResponse.responseText.length > 0 ?
                      <div>
                        <h5>perustelut:</h5>
                        <p>{assessmentResponse.finalGradeResponse.responseText}</p>
                      </div>
                      :
                      null}
                  </Card.Description>
                </Card.Content>
              </Card>
            </div>
            :
            null
        }
      </div >
    )
  return (
    <Container textAlign="center">
      <h2>Vastaukset ja palaute itsearviosta</h2>
      {assessmentType === 'objectives' ? displayObjectivesFeedback() : displayCategoryFeedback()}
      {displayOpenQuestionsAndFinalGrade()}
    </Container>
  )
}


UserResultsPage.propTypes = {
  assessmentResponse: PropTypes.shape().isRequired,
  teacher: PropTypes.bool
}

UserResultsPage.defaultProps = {
  teacher: false
}

export default UserResultsPage

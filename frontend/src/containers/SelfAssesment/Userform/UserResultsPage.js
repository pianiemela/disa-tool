import React from 'react'
import { Card, Form, List, Table, Container } from 'semantic-ui-react'

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

  const renderFunc = () =>
    (
      <Container>
        <div>
          Olet jo vastannut tähän itsearviointiin. Voit tarkastella kootusti tuloksiasi alla.
        {Object.keys(objectives).map(objective => (
            <div>
              <Table fixed compact celled striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan="2">
                      {objective}
                    </Table.HeaderCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.HeaderCell>
                      Tavoite
                  </Table.HeaderCell>
                    <Table.HeaderCell>
                      Arviosi osaamisesta
                  </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {objectives[objective].map(singleO => (
                    <Table.Row>
                      <Table.Cell>
                        {singleO.name}
                      </Table.Cell>
                      <Table.Cell>
                        {singleO.grade}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ))}
        </div >
      </Container>
    )


  if (assessmentType === 'objectives') {
    return renderFunc()
  }
  return (
    <Container textAlign="center">
      <div>
        <h2>Olet jo vastannut tähän itsearviointiin. Voit tarkastella kootusti tuloksiasi alla.</h2>
        {assesmentResponse.questionModuleResponses.map(questionModule => (
          <Card fluid color="red" >
            <Card.Content >
              <Card.Header textAlign="center">
                <h3>{questionModule.name}</h3>
              </Card.Header>
              <Card.Description textAlign="center">
                <h4>Annoit itsellesi arvosanan: {questionModule.grade}</h4>
                <h5>Perustelit sitä seuraavasti: </h5>
                <p>{questionModule.responseText}</p>
              </Card.Description>
            </Card.Content>
          </Card>
        ))}
      </div >
    </Container >
  )
}

export default UserResultsPage

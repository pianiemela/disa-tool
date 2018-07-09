import React from 'react'
import { Form, Card, Grid, Button, Input, Popup } from 'semantic-ui-react'


const OpenQuestionModule = (props) => {

  const { edit, textArea } = props
  const { id, name } = props.data

  return (
    <Form.Field key={id}>
      <Card.Group centered>
        <Card fluid>
          <Card.Content>
            <Card.Header>
              Avoin kysymys: {name}
            </Card.Header>
            <Grid verticalAlign="middle" columns={2}>
              <Grid.Row>
                <Grid.Column width={10}>
                  {textArea('Vastaa avoimeen kysymykseen', 'Kirjoita vastaus tähän', edit)}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      </Card.Group>
    </Form.Field >
  )

}

export default OpenQuestionModule

import React from 'react'
import { Form, Card, Grid, Icon, Popup } from 'semantic-ui-react'


const OpenQuestionModule = (props) => {

  const { edit, textArea, handleChange } = props
  const { id, name } = props.data

  return (
    <Form.Field key={id}>
      <Card.Group centered>
        <Card fluid>
          <Card.Content>
            <Card.Header>
              Avoin kysymys: {name}
            </Card.Header>
            <Grid verticalAlign="middle" columns={3}>
              <Grid.Row>
                <Grid.Column width={10}>
                  {textArea('Vastaa avoimeen kysymykseen', 'Kirjoita vastaus tähän', edit)}
                </Grid.Column>
                <Grid.Column>
                  <Popup
                    trigger={
                      <Icon
                        name="minus circle"
                        size="big"
                        color="red"
                        onClick={() => handleChange({ id, type: 'removeQuestion' })}
                      />
                    }
                    content="Poista avoin kysymys tästä"
                  />
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

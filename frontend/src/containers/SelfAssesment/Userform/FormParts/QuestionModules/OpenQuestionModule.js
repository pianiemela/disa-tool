import React from 'react'
import PropTypes from 'prop-types'
import { Form, Card, Grid, Icon, Popup, Button } from 'semantic-ui-react'
import ModalForm from '../../../../../utils/components/ModalForm'

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
                  <ModalForm
                    header="Poista avoin kysymys"
                    content={
                      <div>
                        <p>Haluatko poistaa avoimen kysymyksen {name}?</p>
                        <Button color="green" onClick={() => handleChange({ id, type: 'removeQuestion' })} type="submit">Ok</Button>
                        <Button color="red">
                          {'Peru'}
                        </Button>
                      </div>
                    }
                    trigger={
                      <Popup
                        trigger={
                          <Icon
                            name="minus circle"
                            size="big"
                            color="red"
                          />
                        }
                        content="Poista avoin kysymys tästä"
                      />
                    }
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

OpenQuestionModule.propTypes = {
  edit: PropTypes.bool.isRequired,
  textArea: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  data: PropTypes.shape().isRequired
}

export default OpenQuestionModule

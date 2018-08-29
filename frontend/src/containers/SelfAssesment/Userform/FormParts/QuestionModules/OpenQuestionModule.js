import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Card, Grid, Icon, Popup, Button, Message } from 'semantic-ui-react'
import ModalForm from '../../../../../utils/components/ModalForm'
import { removeOpenQuestion, openQuestionResponseAction } from '../../../actions/selfAssesment'

const OpenQuestionModule = (props) => {
  const { edit, responseTextError } = props
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
                  <Form.TextArea
                    autoHeight
                    label="Vastaa avoimeen kysymykseen"
                    error={responseTextError !== undefined}
                    placeholder="Kirjoita vastaus tähän"
                    onBlur={!edit ? e =>
                      props.dispatchopenQuestionResponseAction({ id, value: e.target.value })
                      :
                      null
                    }
                    onChange={!edit ? () =>
                      props.clearError({ type: 'openQErrors', errorType: 'responseText', id })
                      : null
                    }
                  />
                  <Message
                    error
                    header={responseTextError ? responseTextError.error : null}
                  />

                </Grid.Column>
                <Grid.Column>
                  {edit ?
                    <ModalForm
                      header="Poista avoin kysymys"
                      content={
                        <div>
                          <p>Haluatko poistaa avoimen kysymyksen {name}?</p>
                          <Button color="green" onClick={() => props.dispatchRemoveOpenQuestion(id)} type="submit">Ok</Button>
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
                    :
                    null
                  }
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
  dispatchRemoveOpenQuestion: PropTypes.func.isRequired,
  data: PropTypes.shape().isRequired,
  dispatchopenQuestionResponseAction: PropTypes.func.isRequired,
  clearError: PropTypes.func,
  responseTextError: PropTypes.shape()
}

OpenQuestionModule.defaultProps = {
  responseTextError: undefined,
  clearError: undefined
}

const mapDispatchToProps = dispatch => ({
  dispatchRemoveOpenQuestion: id =>
    dispatch(removeOpenQuestion(id)),
  dispatchopenQuestionResponseAction: data =>
    dispatch(openQuestionResponseAction(data))
})

export default connect(null, mapDispatchToProps)(OpenQuestionModule)

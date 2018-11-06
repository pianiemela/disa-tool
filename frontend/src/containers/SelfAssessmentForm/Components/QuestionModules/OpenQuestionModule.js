import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Card, Grid, Icon, Popup, Button, Message } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import ModalForm from '../../../../utils/components/ModalForm'
import { removeOpenQuestion, openQuestionResponseAction, clearErrorAction } from '../../actions/selfAssesment'


const OpenQuestionModule = (props) => {
  const { edit, responseTextError, existingAnswer } = props
  const { id, name } = props.data
  const translate = translateId => props.translate(`SelfAssessmentForm.QuestionModules.OpenQuestionModule.${translateId}`)

  const handleTextAreaBlur = e => props.dispatchopenQuestionResponseAction({ id, value: e.target.value }) //eslint-disable-line
  const handleTextAreaChange = () => props.dispatchClearErrorAction({ type: 'openQErrors', errorType: 'responseText', id })

  return (
    <Form error={responseTextError !== undefined}>
      <Form.Field key={id}>
        <Card.Group centered>
          <Card fluid>
            <Card.Content>
              <Card.Header style={{ paddingBottom: '1.5em' }}>
                {name}
              </Card.Header>
              <Grid verticalAlign="middle" columns={3}>
                <Grid.Row>
                  <Grid.Column width={10}>
                    <Form.TextArea
                      autoHeight
                      error={responseTextError !== undefined}
                      placeholder={translate('placeholder')}
                      onBlur={!edit ? handleTextAreaBlur : undefined}
                      onChange={(!edit && responseTextError) ? handleTextAreaChange : undefined}
                      defaultValue={existingAnswer
                        ? existingAnswer.find(existing => existing.id === id).responseText : null}
                    />
                    <Message
                      error
                      content={responseTextError ? responseTextError.error : null}
                    />

                  </Grid.Column>
                  <Grid.Column>
                    {edit ?
                      <ModalForm
                        header={translate('modalHeader')}
                        content={
                          <div>
                            <p>{translate('modalConfirmation')}: {name}?</p>
                            <Button color="red">
                              {translate('modalCancel')}
                            </Button>
                            <Button color="green" onClick={() => props.dispatchRemoveOpenQuestion(id)} type="submit">Ok</Button>
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
                            content={translate('popup')}
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
      </Form.Field>
    </Form>
  )
}

OpenQuestionModule.propTypes = {
  edit: PropTypes.bool.isRequired,
  dispatchRemoveOpenQuestion: PropTypes.func.isRequired,
  data: PropTypes.shape().isRequired,
  dispatchopenQuestionResponseAction: PropTypes.func.isRequired,
  responseTextError: PropTypes.shape(),
  translate: PropTypes.func.isRequired,
  dispatchClearErrorAction: PropTypes.func.isRequired,
  existingAnswer: PropTypes.oneOfType([PropTypes.arrayOf(), PropTypes.arrayOf(PropTypes.shape())])
}

OpenQuestionModule.defaultProps = {
  responseTextError: undefined,
  existingAnswer: undefined
}

const mapDispatchToProps = dispatch => ({
  dispatchRemoveOpenQuestion: id =>
    dispatch(removeOpenQuestion(id)),
  dispatchopenQuestionResponseAction: data =>
    dispatch(openQuestionResponseAction(data)),
  dispatchClearErrorAction: data =>
    dispatch(clearErrorAction(data))

})

export default withLocalize(connect(null, mapDispatchToProps)(OpenQuestionModule))

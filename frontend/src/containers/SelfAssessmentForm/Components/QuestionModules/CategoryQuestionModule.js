import { Form, Card, Grid, Dropdown, Accordion, Icon, Message } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import {
  gradeCategoryAction,
  textfieldResponseAction,
  clearErrorAction
} from '../../actions/selfAssesment'
import MatrixPage from '../../../Course/MatrixPage'

export class CategoryQuestionModule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMatrix: false,
      value: null
    }
  }

  handleDropdownChange = (e, { value }) => {
    console.log(e)
    const { final } = this.props
    const { id } = this.props.data
    this.props.dispatchGradeCategoryAction({ id, value, final })
    this.setState({ value })
    this.props.dispatchClearErrorAction({ type: final ? 'finalGErrors' : 'qModErrors', errorType: 'grade', id })
  }

  handleTextFieldOnBlur = (e) => {
    const { final } = this.props
    const { id } = this.props.data
    this.props.dispatchTextfieldResponseAction({ id, value: e.target.value, final })
  }

  handleTextFieldChange = () => {
    const { final, responseTextError } = this.props
    const { id } = this.props.data
    if (responseTextError) { this.props.dispatchClearErrorAction({ type: final ? 'finalGErrors' : 'qModErrors', errorType: 'responseText', id }) }
  }

  render() {
    const { edit,
      final,
      responseTextError,
      gradeError,
      courseInstanceId,
      grades,
      existingAnswer } = this.props
    const { name, textFieldOn, id } = this.props.data
    const { grade, responseText } = final
      ? existingAnswer
      : existingAnswer.find(answer => answer.id === id)

    const existingGrade = grades.find(g => g.text === grade)
    const translate = translateId => this.props.translate(`SelfAssessmentForm.QuestionModules.CategoryQuestionModule.${translateId}`)

    return (
      <div className="CategoryQuestion">
        <Form error={gradeError !== undefined || responseTextError !== undefined}>
          <Form.Field>
            <div>
              <Card fluid>
                <Card.Content >
                  <Card.Header>
                    {name}
                    {!final &&
                      <Accordion style={{ marginTop: '10px' }} fluid styled>
                        <Accordion.Title
                          active={this.state.showMatrix}
                          onClick={() => this.setState({ showMatrix: !this.state.showMatrix })}
                        >
                          <Icon name="dropdown" />
                          {translate('matrix')}
                        </Accordion.Title>
                        <Accordion.Content active={this.state.showMatrix}>
                          <MatrixPage
                            courseId={courseInstanceId}
                            hideHeader
                            categoryId={id}
                          />
                        </Accordion.Content>
                      </Accordion>
                    }
                  </Card.Header>

                  <Grid verticalAlign="middle" padded columns={3}>
                    <Grid.Row >
                      <Form.Field width={10}>
                        <Grid.Column>
                          <div>
                            <label> {translate('assessment')}</label>
                            <Dropdown
                              className="gradeDropdown"
                              style={{ marginLeft: '20px' }}
                              placeholder={translate('gradeSelect')}
                              selection
                              options={grades}
                              error={gradeError !== undefined}
                              onChange={!edit ? this.handleDropdownChange : null}
                              value={existingGrade ? existingGrade.value : this.state.value}
                            />
                          </div>
                          <Message
                            error
                            content={gradeError ? gradeError.error : null}
                          />
                        </Grid.Column>
                      </Form.Field>
                      <Grid.Column />
                    </Grid.Row>

                    <Grid.Row >
                      <Form.Field width={10}>
                        <Grid.Column>
                          {textFieldOn ?
                            <div>
                              <Form.TextArea
                                autoHeight
                                error={responseTextError !== undefined}
                                label={translate('basis')}
                                placeholder={translate('writeBasis')}
                                onBlur={!edit && this.handleTextFieldOnBlur}
                                onChange={!edit && this.handleTextFieldChange}
                                defaultValue={responseText}
                              />
                              <Message
                                error
                                content={responseTextError ? responseTextError.error : null}
                              />
                            </div>
                            :
                            null
                          }
                        </Grid.Column>
                      </Form.Field>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </div>
          </Form.Field>
        </Form>
      </div>
    )
  }
}

CategoryQuestionModule.defaultProps = {
  final: false,
  courseInstanceId: null,
  responseTextError: undefined,
  gradeError: undefined,
  grades: [],
  existingAnswer: [{
    grade: null,
    responseText: null
  }]
}


CategoryQuestionModule.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    headers: PropTypes.arrayOf(PropTypes.shape()),
    textFieldOn: PropTypes.bool
  }).isRequired,
  final: PropTypes.bool,
  dispatchTextfieldResponseAction: PropTypes.func.isRequired,
  dispatchGradeCategoryAction: PropTypes.func.isRequired,
  dispatchClearErrorAction: PropTypes.func.isRequired,
  responseTextError: PropTypes.shape(),
  gradeError: PropTypes.shape(),
  courseInstanceId: PropTypes.number,
  edit: PropTypes.bool.isRequired,
  grades: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number,
    value: PropTypes.number,
    text: PropTypes.string
  })),
  translate: PropTypes.func.isRequired,
  existingAnswer: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()), PropTypes.shape()])
}

const mapStateToProps = state => ({
  answers: state.selfAssesment.assesmentResponse
})

const mapDispatchToProps = dispatch => ({
  dispatchTextfieldResponseAction: data =>
    dispatch(textfieldResponseAction(data)),
  dispatchGradeCategoryAction: data =>
    dispatch(gradeCategoryAction(data)),
  dispatchClearErrorAction: data =>
    dispatch(clearErrorAction(data))

})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(CategoryQuestionModule))

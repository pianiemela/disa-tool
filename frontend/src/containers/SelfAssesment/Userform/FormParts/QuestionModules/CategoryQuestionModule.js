import { Form, Card, Grid, Dropdown } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { gradeCategoryAction, textfieldResponseAction, toggleTextField, toggleFormPartAction, changeHeaderAction } from '../../../actions/selfAssesment'
import { gradeOptions } from '../../../utils'

export class CategoryQuestionModule extends React.Component {
  constructor(props) {
    super(props)
    this.state = { editHeaders: false, changedHeaders: {} }
  }

  toggleEdit = () => {
    this.setState({ editHeaders: !this.state.editHeaders })
    this.props.dispatchHeaderChange({ changedHeaders: this.state.changedHeaders })
  }

  changeHeader = (id, value) => {
    const oldState = this.state.changedHeaders
    oldState[id] = value
    this.setState({ editHeaders: oldState })
  }

  render() {
    console.log(this.props)
    const { edit, final, responseTextError, gradeError, clearError } = this.props
    const { name, textFieldOn, id, includedInAssesment, headers } = this.props.data

    return (
      <div className="CategoryQuestion">
        <Form.Field>
          <div>
            <Card fluid>
              <Card.Content >
                <Card.Header>
                  {final ? headers[0].value : name}
                </Card.Header>
                <Grid verticalAlign="middle" padded columns={3}>
                  <Grid.Row >
                    <Form.Field width={10}>
                      <Grid.Column>
                        <div>
                          <label> Arvioi osaamisesi asteikolla 1-5</label>
                          <Dropdown
                            style={{ marginLeft: '20px' }}
                            placeholder="Valitse arvosana"
                            selection
                            options={gradeOptions}
                            error={gradeError !== undefined}
                            onChange={!edit ? (e, { value }) => {
                              this.props.dispatchGradeCategoryAction({ id, value, final })
                              this.props.clearError({ type: final ? 'finalGErrors' : 'qModErrors', errorType: 'grade', id })
                            } : null}
                          />
                        </div>
                      </Grid.Column>
                    </Form.Field>
                    <Grid.Column />
                  </Grid.Row>
                  <Grid.Row >
                    <Form.Field width={10}>
                      <Grid.Column>
                        {textFieldOn ?
                          <Form.TextArea
                            autoHeight
                            error={responseTextError !== undefined}
                            label="Perustelut arvosanalle"
                            placeholder="Kirjoita perustelut valitsemallesi arvosanalle"
                            onBlur={!edit ? e =>
                              this.props.dispatchTextfieldResponseAction({
                                id,
                                value: e.target.value,
                                final
                              })
                              :
                              null}
                            onChange={!edit ? () =>
                              this.props.clearError({ type: final ? 'finalGErrors' : 'qModErrors', errorType: 'responseText', id })
                              :
                              null
                            }
                          />
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
        </Form.Field >
      </div>
    )
  }
}

CategoryQuestionModule.defaultProps = {
  final: false
}


CategoryQuestionModule.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    headers: PropTypes.arrayOf(PropTypes.shape()),
    textFieldOn: PropTypes.bool,
    includedInAssesment: PropTypes.bool
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  final: PropTypes.bool,
  dispatchHeaderChange: PropTypes.func.isRequired,
  dispatchTextfieldResponseAction: PropTypes.func.isRequired,
  dispatchGradeCategoryAction: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  answers: state.selfAssesment.assesmentResponse
})

const mapDispatchToProps = dispatch => ({
  dispatchTextFieldOnOff: id =>
    dispatch(toggleTextField(id)),
  dispatchToggleFormPartAction: (id, type) =>
    dispatch(toggleFormPartAction(id, type)),
  dispatchHeaderChange: data =>
    dispatch(changeHeaderAction(data)),
  dispatchTextfieldResponseAction: data =>
    dispatch(textfieldResponseAction(data)),
  dispatchGradeCategoryAction: data =>
    dispatch(gradeCategoryAction(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryQuestionModule)

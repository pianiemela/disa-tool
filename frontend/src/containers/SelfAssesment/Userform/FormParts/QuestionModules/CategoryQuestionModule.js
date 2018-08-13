import { Form, Card, Grid, Checkbox, Dropdown, Button } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UpOrDownToggle from '../UpOrDownToggle'
import { gradeCategoryAction, textfieldResponseAction, toggleTextField, toggleFormPartAction, changeHeaderAction } from '../../../actions/selfAssesment'
import MultiLangInput from '../MultiLangInput'
import { gradeOptions } from '../../../grades'

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
    const { edit, final, responseTextError, gradeError, clearError } = this.props
    const { name, textFieldOn, id, includedInAssesment } = this.props.data

    let disabled = false
    let headercolor = 'black'
    let buttonColor = 'green'
    let buttonText = 'Mukana itsearviossa'
    const { headers } = this.props.data

    if (!includedInAssesment) {
      disabled = true
      headercolor = 'grey'
      buttonColor = 'red'
      buttonText = 'Ei mukana itsearviossa'
    }

    const finalGradeHeader =
      (
        <div>
          {headers ? headers[0].value : null}
          {edit ?
            <Button
              className="editHeadersButton"
              onClick={() => this.toggleEdit()}
              style={{ marginLeft: '10px' }}
            >{this.state.editHeaders ? 'Näytä' : 'Muokkaa'}
            </Button>
            :
            null}
        </div>
      )

    const finalGradeEdit =
      (
        <div>
          {this.state.editHeaders ?
            <Card.Description>
              <MultiLangInput
                handleChange={this.changeHeader}
                headers={headers}
              />
            </Card.Description>
            :
            null
          }
        </div>
      )

    return (
      <div className="CategoryQuestion">
        <Form.Field>
          <div>
            <Card fluid>
              <Card.Content >
                <Card.Header style={{ color: headercolor }}>
                  {final ?
                    finalGradeHeader
                    :
                    name
                  }
                </Card.Header>
                <Card.Description>
                  {finalGradeEdit}
                </Card.Description>
                <Grid verticalAlign="middle" padded columns={3}>
                  <Grid.Row >
                    <Form.Field width={10}>
                      <Grid.Column>
                        {!edit ?
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
                          :
                          null
                        }

                      </Grid.Column>
                    </Form.Field>

                    <Grid.Column>
                      {edit ?
                        <Button
                          className="toggleFormPartButton"
                          size="large"
                          basic
                          color={buttonColor}
                          onClick={() => this.props.dispatchToggleFormPartAction(id, 'category')}
                        >
                          {buttonText}
                        </Button>
                        :
                        null
                      }
                    </Grid.Column>

                  </Grid.Row>
                  <Grid.Row >
                    <Form.Field disabled={disabled} width={10}>
                      <Grid.Column>
                        {!edit && textFieldOn ?
                          <Form.TextArea
                            autoHeight
                            error={responseTextError !== undefined}
                            label="Perustelut arvosanalle"
                            placeholder="Kirjoita perustelut valitsemallesi arvosanalle"
                            onChange={(e) => {
                              this.props.dispatchTextfieldResponseAction({
                                id,
                                value: e.target.value,
                                final
                              })
                              this.props.clearError({ type: final ? 'finalGErrors' : 'qModErrors', errorType: 'responseText', id })
                            }
                            }
                          />
                          :
                          null
                        }
                        {edit && !final ?
                          <Checkbox
                            defaultChecked={textFieldOn}
                            onChange={() => this.props.dispatchTextFieldOnOff(id)}
                            label="Perustelut arvosanalle"
                          />
                          :
                          null
                        }
                      </Grid.Column>
                    </Form.Field>

                    {final || !edit ?
                      null
                      :
                      <Grid.Column>
                        <Form.Field disabled={disabled}>
                          <UpOrDownToggle id={id} />
                        </Form.Field>
                      </Grid.Column>
                    }
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
  dispatchTextFieldOnOff: PropTypes.func.isRequired,
  dispatchToggleFormPartAction: PropTypes.func.isRequired,
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

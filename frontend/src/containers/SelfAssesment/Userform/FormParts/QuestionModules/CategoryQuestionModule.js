import { Form, Card, Grid, Checkbox, Dropdown, Button, Input } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UpOrDownToggle from '../upDownToggle'
import { toggleTextField, toggleFormPartAction, changeHeaderAction } from '../../../actions/selfAssesment'
import MultiLangInput from '../MultiLangInput'

class CategoryQuestionModule extends React.Component {
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
    const { edit, final, textArea } = this.props
    const { name, textFieldOn, id, includedInAssesment } = this.props.data
    let disabled = false
    let headercolor = 'black'
    let buttonColor = 'green'
    let buttonText = 'Mukana itsearviossa'
    let qfield = name
    const { headers } = this.props.data


    if (!includedInAssesment) {
      disabled = true
      headercolor = 'grey'
      buttonColor = 'red'
      buttonText = 'Ei mukana itsearviossa'
    }
    if (final && headers) {
      qfield =
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
    }


    const gradeOptions = [
      {
        text: '1',
        value: 1
      },
      {
        text: '2',
        value: 2
      },
      {
        text: '3',
        value: 3
      },
      {
        text: '4',
        value: 4
      },
      {
        text: '5',
        value: 5
      }
    ]
    const checkbox = edit ? (
      <Checkbox
        defaultChecked={textFieldOn}
        onChange={() => this.props.dispatchTextFieldOnOff(id)}
        label="Perustelut arvosanalle"
      />) : null

    return (
      <Form.Field>
        <Card fluid>
          <Card.Content>
            <Card.Header style={{ color: headercolor }}>
              {headers && final ?
                <div>
                  {this.props.data.headers[0].value}
                  {edit ?
                    <Button
                      onClick={() => this.toggleEdit()}
                      style={{ marginLeft: '10px' }}
                    >{this.state.editHeaders ? 'Näytä' : 'Muokkaa'}
                    </Button>
                    :
                    null}
                </div>
                : qfield
              }
            </Card.Header>
            <Card.Description>
              {qfield}
            </Card.Description>
            <Grid verticalAlign="middle" padded columns={3}>
              <Grid.Row >
                <Form.Field disabled={disabled} width={10}>
                  <Grid.Column>
                    <label> Arvioi osaamisesi asteikolla 1-5</label>
                    <Dropdown style={{ marginLeft: '20px' }} placeholder="Valitse arvosana" selection options={gradeOptions} />
                  </Grid.Column>
                </Form.Field>

                <Grid.Column>
                  {edit ?
                    <Button
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
                    {textArea('Perustelut arvosanalle', 'Kirjoita perustelut valitsemallesi arvosanalle', textFieldOn, final ? null : checkbox)}
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
      </Form.Field >
    )
  }
}

CategoryQuestionModule.defaultProps = {
  final: false
}


CategoryQuestionModule.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  final: PropTypes.bool,
  textArea: PropTypes.func.isRequired,
  dispatchTextFieldOnOff: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  dispatchTextFieldOnOff: id =>
    dispatch(toggleTextField(id)),
  dispatchToggleFormPartAction: (id, type) =>
    dispatch(toggleFormPartAction(id, type)),
  dispatchHeaderChange: data =>
    dispatch(changeHeaderAction(data))
})

export default connect(null, mapDispatchToProps)(CategoryQuestionModule)

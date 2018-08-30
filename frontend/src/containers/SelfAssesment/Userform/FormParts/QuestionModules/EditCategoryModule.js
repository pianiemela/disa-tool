import { Card, Grid, Checkbox, Button, Divider } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UpOrDownToggle from '../UpOrDownToggle'
import { gradeCategoryAction, textfieldResponseAction, toggleTextField, toggleFormPartAction, changeHeaderAction } from '../../../actions/selfAssesment'
import MultiLangInput from '../MultiLangInput'

export class EditCategorymodule extends React.Component {
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
    const { name, textFieldOn, id, includedInAssesment } = this.props.data
    const { final } = this.props
    const { headers } = this.props.data

    const finalGradeHeader =
      (
        <div>
          {headers ? headers[0].value : null}
          <Button
            className="editHeadersButton"
            onClick={() => this.toggleEdit()}
            style={{ marginLeft: '10px' }}
          >{this.state.editHeaders ? 'Näytä' : 'Muokkaa'}
          </Button>
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
      <div>
        <Grid columns="4" padded >
          <Grid.Column width={final ? 8 : null}>
            <h3 style={{ color: includedInAssesment ? 'black' : 'grey' }}>
              {final ? finalGradeHeader : name}
            </h3>
            <Checkbox
              style={{ marginTop: '10px' }}
              defaultChecked={textFieldOn}
              onChange={() => this.props.dispatchTextFieldOnOff(id)}
              label="Perustelut arvosanalle"
              disabled={!includedInAssesment}
            />
            {finalGradeEdit}
          </Grid.Column>
          <Grid.Column floated="right">
            <Button
              style={{ marginTop: '20px' }}
              className="toggleFormPartButton"
              size="large"
              basic
              color={includedInAssesment ? 'green' : 'red'}
              onClick={() => this.props.dispatchToggleFormPartAction(id, 'category')}
            >{includedInAssesment ? 'Mukana itsearviossa' : 'Ei mukana itsearviossa'}
            </Button>
          </Grid.Column>
          <Grid.Column verticalAlign="middle">
            {!final ? <UpOrDownToggle id={id} /> : null}
          </Grid.Column>
        </Grid>
        <Divider fitted />
      </div>
    )
  }
}

EditCategorymodule.defaultProps = {
  final: false
}


EditCategorymodule.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    headers: PropTypes.arrayOf(PropTypes.shape()),
    textFieldOn: PropTypes.bool,
    includedInAssesment: PropTypes.bool
  }).isRequired,
  final: PropTypes.bool,
  dispatchTextFieldOnOff: PropTypes.func.isRequired,
  dispatchToggleFormPartAction: PropTypes.func.isRequired,
  dispatchHeaderChange: PropTypes.func.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(EditCategorymodule)

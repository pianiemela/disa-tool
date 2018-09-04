import { Grid, Checkbox, Button, Divider } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
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
    const translate = translateId => this.props.translate(`SelfAssessment.Userform.FormParts.QuestionModules.EditCategoryModule.${translateId}`)

    const finalGradeHeader =
      (
        <div>
          {name}
          <Button
            className="editHeadersButton"
            onClick={() => this.toggleEdit()}
            style={{ marginLeft: '10px' }}
          >{this.state.editHeaders ? translate('buttonShow') : translate('buttonEdit')}
          </Button>
        </div>
      )

    const finalGradeEdit =
      (
        this.state.editHeaders ?
          (
            <MultiLangInput
              handleChange={this.changeHeader}
              headers={headers}
            />
          )
          :
          null
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
              label={translate('label')}
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
            >{includedInAssesment ? translate('includedButton') : translate('notIncludedButton')}
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
  dispatchHeaderChange: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
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

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(EditCategorymodule))

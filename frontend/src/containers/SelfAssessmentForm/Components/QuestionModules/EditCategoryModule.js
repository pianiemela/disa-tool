import { Grid, Checkbox, Button, Divider } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import UpOrDownToggle from '../UpOrDownToggle'
import { toggleTextField, toggleFormPartAction } from '../../actions/selfAssesment'
import Header from '../Header'

const EditCategorymodule = (props) => {
  const { name, textFieldOn, id, includedInAssesment } = props.data
  const { final } = props
  const { headers } = props.data
  const translate = translateId => props.translate(`SelfAssessmentForm.QuestionModules.EditCategoryModule.${translateId}`)


  return (
    <div>
      <Grid columns="4" padded >
        <Grid.Column width={final ? 8 : null}>
          <Header
            name={name}
            edit
            headers={headers}
            editButton={final}
            style={{ color: (includedInAssesment ? 'black' : 'grey'), textAlign: 'left' }}
          />
          <Checkbox
            style={{ marginTop: '10px' }}
            defaultChecked={textFieldOn}
            onChange={() => props.dispatchTextFieldOnOff(id)}
            label={translate('label')}
            disabled={!includedInAssesment}
          />
        </Grid.Column>
        <Grid.Column floated="right">
          <Button
            style={{ marginTop: '20px' }}
            className="toggleFormPartButton"
            size="large"
            basic
            color={includedInAssesment ? 'green' : 'red'}
            onClick={() => props.dispatchToggleFormPartAction(id, 'category')}
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
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  dispatchTextFieldOnOff: id =>
    dispatch(toggleTextField(id)),
  dispatchToggleFormPartAction: (id, type) =>
    dispatch(toggleFormPartAction(id, type))
})

export default withLocalize(connect(null, mapDispatchToProps)(EditCategorymodule))

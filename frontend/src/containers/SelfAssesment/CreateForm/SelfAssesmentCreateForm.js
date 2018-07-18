import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import SelfAssesmentForm from '../Userform/SelfAssesmentForm'
import asyncAction from '../../../utils/asyncAction'

import { getAllSelfAssesments } from '../services/selfAssesment'
import { createFormJSONStucture } from '../reducers/createFormReducer'
import CategorySelection from './CategorySelection'
import DropDownSelection from './DropDownSelection'

class SelfAssesmentCreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: [],
      selectedView: '',
      dropDownValue: ''
    }
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    let { active } = this.state
    const opened = active.includes(index)
      ? (active = active.filter(i => i !== index))
      : active.concat(index)
    this.setState({ active: opened })
  }

  handleDropdownChange = (e, { value }) => {
    this.setState({ dropDownValue: value })
  }

  sendFormId = () => {
    this.props.createForm(this.state.dropDownValue, this.state.selectedView)
  }

  toggleButton = (e) => {
    const { value } = e.target
    this.setState({ selectedView: value })
  }

  renderCreateOrDraft = () => {
    const { selectedView, formData } = this.state
    const { dropDownCourse, dropdownAssesments } = this.props
    if (!this.state.created) {
      return (
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <DropDownSelection
                options={dropDownCourse}
                placeholder="Valitse kurssi"
                handleChange={this.handleDropdownChange}
              />

              <CategorySelection
                selectedView={selectedView}
                category="category"
                objectives="objectives"
                toggleButton={this.toggleButton}
                sendFormId={this.sendFormId}
              />

            </Grid.Column>
            <Grid.Column>
              <DropDownSelection
                options={dropdownAssesments}
                placeholder="Valitse muokattava itsearviointi"
                submitButton
                label="Muokkaa"
                onSubmit={this.changeEditValue}
              />

            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
    }
    return (<SelfAssesmentForm
      handleChange={this.handleFormChange}
      edit
      created
      formData={formData}
    />)
  }

  render() {
    return <div>{this.renderCreateOrDraft()}</div>
  }
}

const mapDispatchToProps = dispatch => (
  {
    createFormJSONStucture: createFormJSONStucture(dispatch),
    getAllSelfAssesments: asyncAction(getAllSelfAssesments, dispatch)
  }
)

SelfAssesmentCreateForm.propTypes = {
  dropDownCourse: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  dropdownAssesments: PropTypes.arrayOf(PropTypes.shape()),
  createForm: PropTypes.func.isRequired
}

SelfAssesmentCreateForm.defaultProps = {
  dropdownAssesments: []
}

export default connect(mapDispatchToProps)(SelfAssesmentCreateForm)
